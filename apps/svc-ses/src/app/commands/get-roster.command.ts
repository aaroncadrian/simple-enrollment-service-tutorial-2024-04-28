import { Roster } from '../models/roster.model';

export type GetRosterCommandInput = {
  rosterId: string;
};

export type GetRosterCommandOutput = {
  roster: Roster;
};
