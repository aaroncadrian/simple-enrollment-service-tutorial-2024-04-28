import { Body, Controller, Post } from '@nestjs/common';
import {
  ListEnrollmentsCommandInput,
  ListEnrollmentsCommandOutput,
} from '../commands/list-enrollments.command';
import {
  GetEnrollmentCommandInput,
  GetEnrollmentCommandOutput,
} from '../commands/get-enrollment.command';
import { Enrollment } from '../models/enrollment.model';
import {
  CreateEnrollmentCommandInput,
  CreateEnrollmentCommandOutput,
} from '../commands/create-enrollment.command';
import { getCurrentTimestamp } from '../utils/get-current-timestamp';
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DeleteEnrollmentCommandInput,
  DeleteEnrollmentCommandOutput,
} from '../commands/delete-enrollment.command';

@Controller()
export class EnrollmentsController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('ListEnrollments')
  async ListEnrollments(
    @Body() input: ListEnrollmentsCommandInput
  ): Promise<ListEnrollmentsCommandOutput> {
    const { rosterId } = input;

    const enrollments = [];

    return {
      enrollments,
    };
  }

  @Post('GetEnrollment')
  async GetEnrollment(
    @Body() input: GetEnrollmentCommandInput
  ): Promise<GetEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    const enrollment = {} as Enrollment;

    // const result = await this.dynamo.send(new QueryCommand({}));

    return {
      enrollment,
    };
  }

  @Post('CreateEnrollment')
  async CreateEnrollment(
    @Body() input: CreateEnrollmentCommandInput
  ): Promise<CreateEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    const currentTimestamp = getCurrentTimestamp();

    const enrollment: Enrollment = {
      rosterId,
      personId,
      createdAt: currentTimestamp,
    };

    // await this.dynamo.send(new PutItemCommand({
    //
    // }));

    return {
      enrollment,
    };
  }

  @Post('DeleteEnrollment')
  async DeleteEnrollment(
    @Body() input: DeleteEnrollmentCommandInput
  ): Promise<DeleteEnrollmentCommandOutput> {
    const { rosterId, personId } = input;

    // const result = await this.dynamo.send(new DeleteItemCommand({
    //
    // }));

    const enrollment: Enrollment = {} as Enrollment;

    return {
      enrollment,
    };
  }
}
