import { Controller, Post } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from './models/enrollment.model';

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
}
