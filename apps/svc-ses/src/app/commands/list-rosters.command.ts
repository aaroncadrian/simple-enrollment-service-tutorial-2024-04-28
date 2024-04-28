import { Roster } from '../models/roster.model';

export type ListRostersCommandInput = {
  //
};

export type ListRostersCommandOutput = {
  rosters: Roster[];
};
