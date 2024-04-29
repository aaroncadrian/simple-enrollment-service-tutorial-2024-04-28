import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ListRostersCommandInput,
  ListRostersCommandOutput,
} from '../commands/list-rosters.command';
import {
  CreateRosterCommandInput,
  CreateRosterCommandOutput,
} from '../commands/create-roster.command';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
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
import { unmarshallModel } from '../utils/unmarshall-model';

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

    const result = await this.dynamo.send(
      new GetItemCommand({
        TableName: 'local.ses-01',
        Key: marshall({
          pk: rosterId,
          sk: 'DESCRIPTION',
        }),
      })
    );

    const item = result.Item;

    if (!item) {
      throw new BadRequestException('Roster Not Found');
    }

    const rosterDescription = unmarshallModel<RosterDescription>(item);

    return {
      rosterDescription,
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

    const result = await this.dynamo
      .send(
        new DeleteItemCommand({
          ReturnValues: 'ALL_OLD',
          TableName: 'local.ses-01',
          Key: marshall({
            pk: rosterId,
            sk: 'DESCRIPTION',
          }),
          ConditionExpression: 'attribute_exists(#pk)',
          ExpressionAttributeNames: {
            '#pk': 'pk',
          },
        })
      )
      .catch((error) => {
        if (error.name === 'ConditionalCheckFailedException') {
          throw new BadRequestException('Roster Not Found');
        }

        throw error;
      });

    const rosterDescription = unmarshallModel<RosterDescription>(
      result.Attributes
    );

    return {
      rosterDescription,
    };
  }
}
