import Model, { attr } from '@ember-data/model';

export default class ContestModel extends Model {
  // @belongsTo('leaderboard', { async: false }) declare leaderboard: LeaderboardModel;

  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('date') declare startsAt: Date;
  @attr('date') declare endsAt: Date;
  @attr('string') declare type: string;
}
