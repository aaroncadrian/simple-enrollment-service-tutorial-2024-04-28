import { Roster } from '../models/roster.model';

export type DescribeRosterCommandInput = {
  rosterId: string;
};

export type DescribeRosterCommandOutput = {
  roster: Roster;
};
