import { Controller, Post } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

@Controller()
export class EnrollmentsController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('CreateEnrollment')
  async CreateEnrollment() {
    const result = await this.dynamo.send(
      new PutItemCommand({
        // TODO: Add table name
        TableName: '',
        Item: marshall({
          pk: '',
          sk: '',
          personId: '',
          createdAt: '',
        }),
      })
    );

    return {
      enrollment: {
        id: 'hello-world',
      },
    };
  }
}
