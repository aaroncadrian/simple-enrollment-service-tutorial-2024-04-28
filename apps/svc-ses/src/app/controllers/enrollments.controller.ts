import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '../models/enrollment.model';
import { stripPkSk } from '../utils/strip-pk-sk';
import {
  ListEnrollmentsCommandInput,
  ListEnrollmentsCommandOutput,
} from '../commands/list-enrollments.command';
import {
  CreateEnrollmentCommandInput,
  CreateEnrollmentCommandOutput,
} from '../commands/create-enrollment.command';
import {
  DeleteEnrollmentCommandInput,
  DeleteEnrollmentCommandOutput,
} from '../commands/delete-enrollment.command';
import {
  GetEnrollmentCommandInput,
  GetEnrollmentCommandOutput,
} from '../commands/get-enrollment.command';
import { isTransactionCanceledException } from '../utils/is-transaction-canceled-exception';

const ENROLLMENT = 'ENROLLMENT';

@Controller()
export class EnrollmentsController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('ListEnrollments')
  async ListEnrollments(
    @Body() input: ListEnrollmentsCommandInput
  ): Promise<ListEnrollmentsCommandOutput> {
    const { rosterId } = input;

    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: 'local.ses-01',
        KeyConditionExpression:
          '#pk = :pk AND begins_with(#sk, :enrollmentPrefix)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: marshall({
          ':pk': rosterId,
          ':enrollmentPrefix': `${ENROLLMENT}#`,
        }),
      })
    );

    const enrollments: Enrollment[] = result.Items.map(
      (item) => stripPkSk(unmarshall(item) as any) as Enrollment
    );

    return {
      enrollments,
    };
  }

  @Post('GetEnrollment')
  async GetEnrollment(
    @Body() input: GetEnrollmentCommandInput
  ): Promise<GetEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    const result = await this.dynamo.send(
      new GetItemCommand({
        TableName: 'local.ses-01',
        Key: marshall({
          pk: rosterId,
          sk: `${ENROLLMENT}#${personId}`,
        }),
      })
    );

    const item = result.Item;

    if (!item) {
      throw new BadRequestException('Enrollment Not Found');
    }

    const enrollment = stripPkSk(unmarshall(item) as any) as Enrollment;

    return {
      enrollment,
    };
  }

  @Post('CreateEnrollment')
  async CreateEnrollment(
    @Body() input: CreateEnrollmentCommandInput
  ): Promise<CreateEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    const currentTimestamp = new Date().toISOString();

    const enrollment: Enrollment = {
      rosterId,
      personId,
      createdAt: currentTimestamp,
    };

    await this.dynamo
      .send(
        new TransactWriteItemsCommand({
          TransactItems: [
            // Enforce roster existence and enrollment limit
            {
              Update: {
                ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
                TableName: 'local.ses-01',
                Key: marshall({
                  pk: rosterId,
                  sk: 'ENROLLMENT_TRACKER',
                }),
                UpdateExpression: 'ADD enrollmentIds :enrollmentIds',
                ConditionExpression:
                  'attribute_exists(pk) AND (enrollmentLimit = :unlimited OR attribute_not_exists(enrollmentIds) OR size(enrollmentIds) < enrollmentLimit)',
                ExpressionAttributeValues: marshall({
                  ':enrollmentIds': new Set([personId]),
                  ':unlimited': 'UNLIMITED',
                }),
              },
            },
            // Create enrollment
            {
              Put: {
                TableName: 'local.ses-01',
                Item: marshall({
                  pk: rosterId,
                  sk: `ENROLLMENT#${personId}`,
                  ...enrollment,
                }),
                ConditionExpression: 'attribute_not_exists(pk)',
              },
            },
          ],
        })
      )
      .catch((error) => {
        if (isTransactionCanceledException(error)) {
          if (error.CancellationReasons[0].Code === 'ConditionalCheckFailed') {
            if (error.CancellationReasons[0].Item) {
              throw new BadRequestException('Enrollment Limit Exceeded');
            } else {
              throw new BadRequestException('Roster Not Found');
            }
          }

          if (error.CancellationReasons[1].Code === 'ConditionalCheckFailed') {
            throw new BadRequestException('Enrollment Already Exists');
          }
        }

        throw error;
      });

    return {
      enrollment,
    };
  }

  @Post('DeleteEnrollment')
  async DeleteEnrollment(
    @Body() input: DeleteEnrollmentCommandInput
  ): Promise<DeleteEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    await this.dynamo
      .send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Delete: {
                TableName: 'local.ses-01',
                Key: marshall({
                  pk: rosterId,
                  sk: `ENROLLMENT#${personId}`,
                }),
                ConditionExpression: 'attribute_exists(#pk)',
                ExpressionAttributeNames: {
                  '#pk': 'pk',
                },
              },
            },
            {
              Update: {
                TableName: 'local.ses-01',
                Key: marshall({
                  pk: rosterId,
                  sk: 'ENROLLMENT_TRACKER',
                }),
                UpdateExpression: 'DELETE enrollmentIds :enrollmentIds',
                ExpressionAttributeValues: marshall({
                  ':enrollmentIds': new Set([personId]),
                }),
              },
            },
          ],
        })
      )
      .catch((error) => {
        if (isTransactionCanceledException(error)) {
          throw new BadRequestException('Enrollment Not Found');
        }

        throw error;
      });

    return {
      success: true,
    };
  }
}
