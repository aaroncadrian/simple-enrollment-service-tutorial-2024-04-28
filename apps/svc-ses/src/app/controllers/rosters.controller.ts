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
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DeleteRosterCommandInput,
  DeleteRosterCommandOutput,
} from '../commands/delete-roster.command';
import { RosterDescription } from '../models/roster-description.model';
import {
  DescribeRosterCommandInput,
  DescribeRosterCommandOutput,
} from '../commands/describe-roster.command';
import { marshall } from '@aws-sdk/util-dynamodb';

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

    const roster = {} as RosterDescription;

    // const result = await this.dynamo.send(new QueryCommand({}));

    return {
      roster,
    };
  }

  @Post('CreateRoster')
  async CreateRoster(
    @Body() input: CreateRosterCommandInput
  ): Promise<CreateRosterCommandOutput> {
    const { rosterId, enrollmentLimit } = input;

    const rosterDescription: RosterDescription = {
      rosterId,
      enrollmentLimit,
    };

    await this.dynamo.send(
      new PutItemCommand({
        TableName: 'local.ses-01',
        Item: marshall({
          pk: rosterId,
          sk: 'DESCRIPTION',
          ...rosterDescription,
        }),
      })
    );

    return {
      rosterDescription,
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

    const roster: RosterDescription = {} as RosterDescription;

    return {
      roster,
    };
  }
}
