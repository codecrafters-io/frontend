import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import CourseIdeaSupervoteModel from 'codecrafters-frontend/models/course-idea-supervote';
import CourseIdeaVoteModel from 'codecrafters-frontend/models/course-idea-vote';
import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany, type SyncHasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import { SafeString } from '@ember/template/-private/handlebars';

export default class CourseIdeaModel extends Model {
  @hasMany('course-idea-vote', { async: false }) declare currentUserVotes: SyncHasMany<CourseIdeaVoteModel>;
  @hasMany('course-idea-supervote', { async: false }) declare currentUserSupervotes: SyncHasMany<CourseIdeaSupervoteModel>

  @attr('date') declare createdAt: Date;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare developmentStatus: string;
  @attr('boolean') declare isArchived: boolean;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('number') declare votesCount: number;
  @attr('number') declare supervotesCount: number;

  @equal('developmentStatus', 'not_started') declare developmentStatusIsNotStarted: boolean;
  @equal('developmentStatus', 'in_progress') declare developmentStatusIsInProgress: boolean;
  @equal('developmentStatus', 'released') declare developmentStatusIsReleased: boolean;

  @service declare authenticator: AuthenticatorService;

  get descriptionHtml(): SafeString {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get isNewlyCreated(): boolean {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votesCount < 20;
  }

  get reverseSortPositionForCourseIdeasPage(): string {
    let reverseSortPositionFromDevelopmentStatus = {
      not_started: 3,
      in_progress: 2,
      released: 1,
    }[this.developmentStatus];

    return `${reverseSortPositionFromDevelopmentStatus}-${this.createdAt.toISOString()}`;
  }

  async supervote(): Promise<CourseIdeaSupervoteModel> {
    this.supervotesCount += 1;

    const supervote: CourseIdeaSupervoteModel = this.store.createRecord('course-idea-supervote', { courseIdea: this, user: this.authenticator.currentUser });

    await supervote.save();

    this.currentUserSupervotes = [...this.currentUserSupervotes.toArray(), supervote] as unknown as SyncHasMany<CourseIdeaSupervoteModel>;

    return supervote;
  }

  async vote(): Promise<CourseIdeaVoteModel> {
    this.votesCount += 1;

    const vote: CourseIdeaVoteModel = this.store.createRecord('course-idea-vote', { courseIdea: this, user: this.authenticator.currentUser });

    await vote.save();

    this.currentUserVotes = [...this.currentUserVotes.toArray(), vote] as unknown as SyncHasMany<CourseIdeaVoteModel>;

    return vote;
  }

  declare unvote: (this: Model, payload: any) => Promise<void>;
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-ignore
    for (const record of [...this.currentUserSupervotes]) {
      // @ts-ignore
      this.supervotesCount -= 1;
      record.unloadRecord();
    }

    // @ts-ignore
    for (const record of [...this.currentUserVotes]) {
      // @ts-ignore
      this.votesCount -= 1;
      record.unloadRecord();
    }
  },
});
