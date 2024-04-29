import { RosterDescription } from '../models/roster-description.model';

export type DescribeRosterCommandInput = {
  rosterId: string;
};

export type DescribeRosterCommandOutput = {
  roster: RosterDescription;
};
