import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { RostersController } from './controllers/rosters.controller';
import { RosterGroupsController } from './controllers/roster-groups.controller';

@Module({
  controllers: [
    EnrollmentsController,
    RostersController,
    RosterGroupsController,
  ],
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
