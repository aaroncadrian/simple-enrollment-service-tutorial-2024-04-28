import { Body, Controller, Post } from '@nestjs/common';
import {
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

@Controller()
export class EnrollmentsController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('CreateEnrollment')
  async CreateEnrollment() {
    const rosterId = 'walt-disney-apartment-tour-monday-2pm';
    const personId = 'aaron';

    const currentTimestamp = new Date().toISOString();

    const enrollment: Enrollment = {
      rosterId,
      personId,
      createdAt: currentTimestamp,
    };

    const result = await this.dynamo.send(
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
      result,
    };
  }

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
}
