import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnrollmentsController } from './enrollments.controller';

@Module({
  imports: [],
  controllers: [AppController, EnrollmentsController],
  providers: [AppService],
})
export class AppModule {}
