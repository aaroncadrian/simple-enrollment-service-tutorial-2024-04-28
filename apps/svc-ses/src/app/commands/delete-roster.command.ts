import { Roster } from '../models/roster.model';

export type DeleteRosterCommandInput = {
  rosterId: string;
};

export type DeleteRosterCommandOutput = {
  roster: Roster;
};
