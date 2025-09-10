import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';
import type UserModel from './user';
import CourseModel from './course';
import { collectionAction } from 'ember-api-actions';

export default class LeaderboardEntryModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: 'entries' }) declare leaderboard: LeaderboardModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @attr('boolean') declare isBanned: boolean;
  @attr('number') declare score: number;
  @attr('number') declare scoreUpdatesCount: number;

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedCourseSlugs: string[];

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedLanguageSlugs: string[];

  get relatedCourses(): CourseModel[] {
    const allCourses = this.store.peekAll('course');

    return this.relatedCourseSlugs.map((slug) => allCourses.find((course) => course.slug === slug)).filter(Boolean);
  }

  declare fetchForCurrentUser: (this: Model, payload: unknown) => Promise<LeaderboardEntryModel[]>;
}

LeaderboardEntryModel.prototype.fetchForCurrentUser = collectionAction({
  path: 'for-current-user',
  type: 'get',
  urlType: 'findAll',

  after(response) {
    if (response.data) {
      this.store.pushPayload(response);

      return response.data.map((data: { id: string }) => this.store.peekRecord('leaderboard-entry', data.id));
    } else {
      return [];
    }
  },
});
