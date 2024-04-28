import { RosterGroupDescription } from '../models/roster-group.model';

export type DeleteRosterGroupCommandInput = {
  groupId: string;
};

export type DeleteRosterGroupCommandOutput = {
  groupDescription: RosterGroupDescription;
};
