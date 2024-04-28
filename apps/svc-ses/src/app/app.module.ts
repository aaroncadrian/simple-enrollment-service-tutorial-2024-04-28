import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EnrollmentsController } from './controllers/enrollments.controller';

@Module({
  controllers: [EnrollmentsController],
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
