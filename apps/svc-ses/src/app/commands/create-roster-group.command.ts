import { RosterGroupDescription } from '../models/roster-group.model';

export type CreateRosterGroupCommandInput = {
  groupId: string;
};

export type CreateRosterGroupCommandOutput = {
  groupDescription: RosterGroupDescription;
};
