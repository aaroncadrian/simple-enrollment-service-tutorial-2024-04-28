import { Body, Controller, Post } from '@nestjs/common';
import {
  ListRosterGroupsCommandInput,
  ListRosterGroupsCommandOutput,
} from '../commands/list-roster-groups.command';
import {
  CreateRosterGroupCommandInput,
  CreateRosterGroupCommandOutput,
} from '../commands/create-roster-group.command';
import { getCurrentTimestamp } from '../utils/get-current-timestamp';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteRosterGroupCommandInput,
  DeleteRosterGroupCommandOutput,
} from '../commands/delete-roster-group.command';
import { RosterGroup } from '../models/roster-group.model';
import {
  DescribeRosterGroupCommandInput,
  DescribeRosterGroupCommandOutput,
} from '../commands/describe-roster-group.command';

@Controller()
export class RosterGroupsController {
  constructor(private dynamo: DynamoDBClient) {}

  @Post('ListRosterGroups')
  async ListRosterGroups(
    @Body() _input: ListRosterGroupsCommandInput
  ): Promise<ListRosterGroupsCommandOutput> {
    const groupIds = [];

    return {
      groupIds,
    };
  }

  @Post('DescribeRosterGroup')
  async DescribeRosterGroup(
    @Body() input: DescribeRosterGroupCommandInput
  ): Promise<DescribeRosterGroupCommandOutput> {
    const { groupId } = input;

    const group = {} as RosterGroup;

    // const result = await this.dynamo.send(new QueryCommand({}));

    return {
      group,
    };
  }

  @Post('CreateRosterGroup')
  async CreateRosterGroup(
    @Body() input: CreateRosterGroupCommandInput
  ): Promise<CreateRosterGroupCommandOutput> {
    const { groupId } = input;

    const currentTimestamp = getCurrentTimestamp();

    const group: RosterGroup = {
      groupId,
      createdAt: currentTimestamp,
    };

    // await this.dynamo.send(new PutItemCommand({
    //
    // }));

    return {
      group,
    };
  }

  @Post('DeleteRosterGroup')
  async DeleteRosterGroup(
    @Body() input: DeleteRosterGroupCommandInput
  ): Promise<DeleteRosterGroupCommandOutput> {
    const { groupId } = input;

    // const result = await this.dynamo.send(new DeleteItemCommand({
    //
    // }));

    const group: RosterGroup = {} as RosterGroup;

    return {
      group,
    };
  }
}
