import { Body, Controller, Post } from '@nestjs/common';
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from './models/enrollment.model';
import { stripPkSk } from './utils/strip-pk-sk';
import {
  ListEnrollmentsCommandInput,
  ListEnrollmentsCommandOutput,
} from './commands/list-enrollments.command';
import {
  CreateEnrollmentCommandInput,
  CreateEnrollmentCommandOutput,
} from './commands/create-enrollment.command';
import {
  DeleteEnrollmentCommandInput,
  DeleteEnrollmentCommandOutput,
} from './commands/delete-enrollment.command';

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
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: marshall({
          ':pk': rosterId,
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

    await this.dynamo.send(
      new PutItemCommand({
        TableName: 'local.ses-01',
        Item: marshall({
          pk: rosterId,
          sk: personId,
          ...enrollment,
        }),
      })
    );

    return {
      enrollment,
    };
  }

  @Post('DeleteEnrollment')
  async DeleteEnrollment(
    @Body() input: DeleteEnrollmentCommandInput
  ): Promise<DeleteEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    const result = await this.dynamo.send(
      new DeleteItemCommand({
        ReturnValues: 'ALL_OLD',
        TableName: 'local.ses-01',
        Key: marshall({
          pk: rosterId,
          sk: personId,
        }),
      })
    );

    const enrollment = stripPkSk(
      unmarshall(result.Attributes) as any
    ) as Enrollment;

    return {
      enrollment,
    };
  }
}
