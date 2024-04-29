import { RosterDescription } from '../models/roster-description.model';

export type CreateRosterCommandInput = {
  rosterId: string;
  enrollmentLimit: number | 'UNLIMITED';
};

export type CreateRosterCommandOutput = {
  rosterDescription: RosterDescription;
};
