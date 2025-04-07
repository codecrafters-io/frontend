import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type { ContestRouteModel } from 'codecrafters-frontend/routes/contest';

export default class ContestController extends Controller {
  declare model: ContestRouteModel;
  @tracked surroundingLeaderboardEntries: LeaderboardEntryModel[] = [];
}
