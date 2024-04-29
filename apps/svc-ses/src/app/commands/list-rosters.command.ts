import { RosterDescription } from '../models/roster-description.model';

export type ListRostersCommandInput = {
  //
};

export type ListRostersCommandOutput = {
  rosters: RosterDescription[];
};
