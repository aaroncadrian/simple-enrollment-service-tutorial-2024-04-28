import { Roster } from '../models/roster.model';

export type CreateRosterCommandInput = {
  rosterId: string;
};

export type CreateRosterCommandOutput = {
  roster: Roster;
};
