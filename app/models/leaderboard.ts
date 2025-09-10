import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type ContestModel from './contest';
import type LeaderboardEntryModel from './leaderboard-entry';
import type LanguageModel from './language';

export default class LeaderboardModel extends Model {
  @belongsTo('contest', { async: false, inverse: 'leaderboard' }) declare contest: ContestModel;
  @belongsTo('language', { async: false, inverse: 'leaderboard' }) declare language: LanguageModel | null;

  @hasMany('leaderboard-entry', { async: false, inverse: 'leaderboard' }) declare entries: LeaderboardEntryModel[];

  @attr('string') declare type: string;
  @attr('number') declare highestPossibleScore: number;
}
