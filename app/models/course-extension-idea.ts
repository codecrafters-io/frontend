import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';
import type CourseModel from './course';
import type CourseExtensionIdeaVoteModel from './course-extension-idea-vote';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class CourseExtensionIdeaModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensionIdeas' }) declare course: CourseModel;

  @hasMany('course-extension-idea-vote', { async: false, inverse: 'courseExtensionIdea' }) declare currentUserVotes: CourseExtensionIdeaVoteModel[];

  @attr('date') declare createdAt: Date;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare developmentStatus: string;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('number') declare votesCount: number;

  @service declare authenticator: AuthenticatorService;

  get developmentStatusIsInProgress() {
    return this.developmentStatus === 'in_progress';
  }

  get developmentStatusIsNotStarted() {
    return this.developmentStatus === 'not_started';
  }

  get developmentStatusIsReleased() {
    return this.developmentStatus === 'released';
  }

  get isNewlyCreated(): boolean {
    // 30 days or less old or less than 20 votes
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24 * 1000) || this.votesCount < 20;
  }

  get reverseSortPositionForRoadmapPage(): string {
    const reverseSortPositionFromDevelopmentStatus = {
      not_started: 3,
      in_progress: 2,
      released: 1,
    }[this.developmentStatus];

    return `${reverseSortPositionFromDevelopmentStatus}-${this.createdAt.toISOString()}`;
  }

  async vote() {
    this.votesCount += 1;

    const vote = this.store.createRecord('course-extension-idea-vote', { courseExtensionIdea: this, user: this.authenticator.currentUser });

    await vote.save();

    return vote;
  }

  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CourseExtensionIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-expect-error
    for (const record of [...this.currentUserVotes]) {
      // @ts-expect-error
      this.votesCount -= 1;
      record.unloadRecord();
    }
  },
});
