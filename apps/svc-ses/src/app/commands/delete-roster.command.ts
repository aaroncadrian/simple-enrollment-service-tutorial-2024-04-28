import { RosterDescription } from '../models/roster-description.model';

export type DeleteRosterCommandInput = {
  rosterId: string;
};

export type DeleteRosterCommandOutput = {
  roster: RosterDescription;
};
