import { RosterDescription } from '../models/roster-description.model';

export type CreateRosterCommandInput = {
  rosterId: string;
};

export type CreateRosterCommandOutput = {
  roster: RosterDescription;
};
