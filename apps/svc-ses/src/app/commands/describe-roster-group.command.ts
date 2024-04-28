import { RosterGroup } from '../models/roster-group.model';

export type DescribeRosterGroupCommandInput = {
  groupId: string;
};

export type DescribeRosterGroupCommandOutput = {
  group: RosterGroup;
};
