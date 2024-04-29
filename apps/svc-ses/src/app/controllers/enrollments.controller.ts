import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
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
import { isConditionalCheckFailedException } from '../utils/is-conditional-check-failed-exception';

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
        new PutItemCommand({
          TableName: 'local.ses-01',
          Item: marshall({
            pk: rosterId,
            sk: `ENROLLMENT#${personId}`,
            ...enrollment,
          }),
          ConditionExpression: 'attribute_not_exists(pk)',
        })
      )
      .catch((error) => {
        if (isConditionalCheckFailedException(error)) {
          throw new BadRequestException('Enrollment Already Exists');
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

    const result = await this.dynamo
      .send(
        new DeleteItemCommand({
          ReturnValues: 'ALL_OLD',
          TableName: 'local.ses-01',
          Key: marshall({
            pk: rosterId,
            sk: `ENROLLMENT#${personId}`,
          }),
          ConditionExpression: 'attribute_exists(#pk)',
          ExpressionAttributeNames: {
            '#pk': 'pk',
          },
        })
      )
      .catch((error) => {
        if (isConditionalCheckFailedException(error)) {
          throw new BadRequestException('Enrollment Not Found');
        }

        throw error;
      });

    const enrollment = stripPkSk(
      unmarshall(result.Attributes) as any
    ) as Enrollment;

    return {
      enrollment,
    };
  }
}
