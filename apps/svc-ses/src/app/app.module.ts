import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnrollmentsController } from './enrollments.controller';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  imports: [],
  controllers: [AppController, EnrollmentsController],
  providers: [
    AppService,
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
