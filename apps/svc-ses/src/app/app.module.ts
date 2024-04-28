import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { RostersController } from './controllers/rosters.controller';

@Module({
  controllers: [EnrollmentsController, RostersController],
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
