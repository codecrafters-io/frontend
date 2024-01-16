import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';
import type UserModel from './user';

export default class LeaderboardEntryModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: 'entries' }) declare leaderboard: LeaderboardModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @attr('boolean') declare isBanned: boolean;
  @attr('number') declare score: number;

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedLanguageSlugs: string[];

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedConceptSlugs: string[];
}
