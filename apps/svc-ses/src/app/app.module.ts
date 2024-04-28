import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  controllers: [],
  providers: [
    {
      provide: DynamoDBClient,
      useValue: new DynamoDBClient({
        region: 'us-west-2',
        endpoint: 'http://localhost:8000',
      }),
    },
  ],
})
export class AppModule {}
