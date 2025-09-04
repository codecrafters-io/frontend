import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';
import type UserModel from './user';

export default class LeaderboardRankCalculationModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: null }) declare leaderboard: LeaderboardModel;
  @belongsTo('user', { async: false, inverse: 'leaderboardRankCalculations' }) declare user: UserModel;

  @attr('date') declare calculatedAt: Date;
  @attr('number') declare rank: number;
}
