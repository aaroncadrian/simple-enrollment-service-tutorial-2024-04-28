import { RosterGroup } from '../models/roster-group.model';

export type DeleteRosterGroupCommandInput = {
  groupId: string;
};

export type DeleteRosterGroupCommandOutput = {
  group: RosterGroup;
};
