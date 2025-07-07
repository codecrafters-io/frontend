import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import CourseIdeaVoteModel from 'codecrafters-frontend/models/course-idea-vote';
import DateService from 'codecrafters-frontend/services/date';
import Model from '@ember-data/model';
import { type SyncHasMany, attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import { getSortPositionForRoadmapPage } from 'codecrafters-frontend/utils/roadmap-sorting';

export default class CourseIdeaModel extends Model {
  @hasMany('course-idea-vote', { async: false, inverse: 'courseIdea' }) declare currentUserVotes: SyncHasMany<CourseIdeaVoteModel>;

  @attr('date') declare createdAt: Date;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare developmentStatus: string;
  @attr('boolean') declare isArchived: boolean;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('number') declare votesCount: number;

  @equal('developmentStatus', 'not_started') declare developmentStatusIsNotStarted: boolean;
  @equal('developmentStatus', 'in_progress') declare developmentStatusIsInProgress: boolean;
  @equal('developmentStatus', 'released') declare developmentStatusIsReleased: boolean;

  @service declare authenticator: AuthenticatorService;
  @service declare date: DateService;

  private _cachedSortPosition: string | null = null;

  get isNewlyCreated(): boolean {
    // 30 days or less old or less than 100 votes
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24 * 1000) || this.votesCount < 100;
  }

  get sortPositionForRoadmapPage(): string {
    if (this._cachedSortPosition === null) {
      this._cachedSortPosition = getSortPositionForRoadmapPage(
        this.developmentStatus,
        this.votesCount,
        this.id,
        this.date.now(),
        this.authenticator.currentUserId,
      );
    }

    return this._cachedSortPosition;
  }

  async vote(): Promise<CourseIdeaVoteModel> {
    this.votesCount += 1;

    const vote = this.store.createRecord('course-idea-vote', { courseIdea: this, user: this.authenticator.currentUser }) as CourseIdeaVoteModel;

    await vote.save();

    return vote;
  }

  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-ignore
    for (const record of [...this.currentUserVotes]) {
      // @ts-ignore
      this.votesCount -= 1;
      record.unloadRecord();
    }
  },
});
