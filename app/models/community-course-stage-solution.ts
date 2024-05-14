import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseStageCommentModel from './course-stage-comment';
import type CourseStageModel from './course-stage';
import type LanguageModel from './language';
import type UserModel from './user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';
import { FileComparisonFromJSON, type FileComparison } from 'codecrafters-frontend/utils/file-comparison';

/* eslint-disable ember/no-mixins */
import ViewableMixin from 'codecrafters-frontend/mixins/viewable';
import type CourseStageScreencastModel from './course-stage-screencast';
import VotableMixin from 'codecrafters-frontend/mixins/votable';

export default class CommunityCourseStageSolutionModel extends Model.extend(ViewableMixin, VotableMixin) {
  static defaultIncludedResources = ['user', 'language', 'comments', 'comments.user', 'comments.target', 'course-stage'];

  @service declare authenticator: AuthenticatorService; // used by VotableMixin

  @belongsTo('course-stage', { async: false, inverse: 'communitySolutions' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @hasMany('community-course-stage-solution-comment', { async: false, inverse: 'target' }) declare comments: CourseStageCommentModel[];
  @hasMany('course-stage-screencast', { async: false, inverse: null }) declare screencasts: CourseStageScreencastModel[];

  // @ts-expect-error empty '' not supported
  @attr('') changedFiles: { diff: string; filename: string }[]; // free-form JSON

  @attr('number') declare approvedCommentsCount: number;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare commitSha: string;
  @attr('string') declare githubRepositoryName: string;
  @attr('boolean') declare githubRepositoryIsPrivate: boolean;
  @attr('boolean') declare isPinned: boolean;
  @attr('number') declare ratingEstimate: number | null;
  @attr('number') declare ratingMean: number | null;
  @attr('number') declare ratingStandardDeviation: number | null;
  @attr('date') declare submittedAt: Date;
  @attr('boolean') declare isRestrictedToTeam: boolean; // if true, only fellow team members can see this solution

  // We don't render explanations at the moment
  get hasExplanation() {
    return !!this.explanationMarkdown;
  }

  get isPublishedToGithub() {
    return this.githubRepositoryName;
  }

  get isPublishedToPublicGithubRepository() {
    return this.isPublishedToGithub && !this.githubRepositoryIsPrivate;
  }

  get ratingEstimateRounded() {
    if (this.ratingEstimate === null) {
      return null;
    }

    return Math.round(this.ratingEstimate * 100) / 100;
  }

  get ratingMeanRounded() {
    if (this.ratingMean === null) {
      return null;
    }

    return Math.round(this.ratingMean * 100) / 100;
  }

  get ratingStandardDeviationRounded() {
    if (this.ratingStandardDeviation === null) {
      return null;
    }

    return Math.round(this.ratingStandardDeviation * 100) / 100;
  }

  get screencast() {
    return this.screencasts[0];
  }

  @action
  githubUrlForFile(filename: string) {
    return `https://github.com/${this.githubRepositoryName}/blob/${this.commitSha}/${filename}`;
  }

  declare fetchFileComparisons: (this: Model, payload: unknown) => Promise<FileComparison[]>;
  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CommunityCourseStageSolutionModel.prototype.fetchFileComparisons = memberAction({
  path: 'file-comparisons',
  type: 'get',

  after(response) {
    return response.map((json: Record<string, unknown>) => FileComparisonFromJSON(json));
  },
});

// TODO: Move to "VotableMixin"?
CommunityCourseStageSolutionModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserUpvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.upvotesCount -= 1;
      record.unloadRecord();
    }

    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserDownvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.downvotesCount -= 1;
      record.unloadRecord();
    }
  },
});
