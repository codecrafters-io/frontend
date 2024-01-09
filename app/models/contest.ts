import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';

export default class ContestModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: 'contest' }) declare leaderboard: LeaderboardModel;

  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('string') declare instructionsMarkdown: string;
  @attr('string') declare prizeDetailsMarkdown: string;
  @attr('date') declare startsAt: Date;
  @attr('date') declare endsAt: Date;
  @attr('string') declare type: string;

  get hasNotStarted(): boolean {
    return !this.hasStarted;
  }

  get hasStarted(): boolean {
    return new Date() > this.startsAt;
  }

  get leaderboardEntriesAreNotRevealed(): boolean {
    return new Date() < this.leaderboardEntriesRevealedAt;
  }

  get leaderboardEntriesRevealedAt(): Date {
    return new Date(this.startsAt.getTime() + 1000 * 60 * 60 * 24); // 24 hours after contest starts
  }
}
