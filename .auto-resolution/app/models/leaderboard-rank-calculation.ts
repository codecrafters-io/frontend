import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';
import type UserModel from './user';

export default class LeaderboardRankCalculationModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: null }) declare leaderboard: LeaderboardModel;
  @belongsTo('user', { async: false, inverse: 'leaderboardRankCalculations' }) declare user: UserModel;

  @attr('date') declare calculatedAt: Date;
  // @ts-expect-error: empty transform not supported
  @attr('') declare nextRanksWithScores?: { rank: number; score: number }[];
  @attr('number') declare rank: number;
}
