import { Body, Controller, Post } from '@nestjs/common';
import {
  ListRostersCommandInput,
  ListRostersCommandOutput,
} from '../commands/list-rosters.command';
import {
  CreateRosterCommandInput,
  CreateRosterCommandOutput,
} from '../commands/create-roster.command';
import { getCurrentTimestamp } from '../utils/get-current-timestamp';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteRosterCommandInput,
  DeleteRosterCommandOutput,
} from '../commands/delete-roster.command';
import { Roster } from '../models/roster.model';
import {
  DescribeRosterCommandInput,
  DescribeRosterCommandOutput,
} from '../commands/describe-roster.command';

@Controller()
export class RostersController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('ListRosters')
  async ListRosters(
    @Body() _input: ListRostersCommandInput
  ): Promise<ListRostersCommandOutput> {
    const rosters = [];

    return {
      rosters,
    };
  }

  @Post('DescribeRoster')
  async DescribeRoster(
    @Body() input: DescribeRosterCommandInput
  ): Promise<DescribeRosterCommandOutput> {
    const { rosterId } = input;

    const roster = {} as Roster;

    // const result = await this.dynamo.send(new QueryCommand({}));

    return {
      roster,
    };
  }

  @Post('CreateRoster')
  async CreateRoster(
    @Body() input: CreateRosterCommandInput
  ): Promise<CreateRosterCommandOutput> {
    const { rosterId } = input;

    const currentTimestamp = getCurrentTimestamp();

    const roster: Roster = {
      rosterId,
      createdAt: currentTimestamp,
    };

    // await this.dynamo.send(new PutItemCommand({
    //
    // }));

    return {
      roster,
    };
  }

  @Post('DeleteRoster')
  async DeleteRoster(
    @Body() input: DeleteRosterCommandInput
  ): Promise<DeleteRosterCommandOutput> {
    const { rosterId } = input;

    // const result = await this.dynamo.send(new DeleteItemCommand({
    //
    // }));

    const roster: Roster = {} as Roster;

    return {
      roster,
    };
  }
}
