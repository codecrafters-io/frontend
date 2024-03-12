import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type CourseStageCommentModel from './course-stage-comment';
import type CourseStageModel from './course-stage';
import type LanguageModel from './language';
import type UserModel from './user';
import { action } from '@ember/object';
import { memberAction } from 'ember-api-actions';
import { FileComparisonFromJSON, type FileComparison } from 'codecrafters-frontend/utils/file-comparison';

/* eslint-disable ember/no-mixins */
import ViewableMixin from 'codecrafters-frontend/mixins/viewable';

export default class CommunityCourseStageSolutionModel extends Model.extend(ViewableMixin) {
  static defaultIncludedResources = ['user', 'language', 'comments', 'comments.user', 'comments.target', 'course-stage'];

  @belongsTo('course-stage', { async: false, inverse: 'communitySolutions' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @hasMany('community-course-stage-solution-comment', { async: false, inverse: 'target' }) declare comments: CourseStageCommentModel[];

  // @ts-expect-error empty '' not supported
  @attr('') changedFiles: { diff: string; filename: string }[]; // free-form JSON

  @attr('number') declare approvedCommentsCount: number;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare commitSha: string;
  @attr('string') declare githubRepositoryName: string;
  @attr('boolean') declare githubRepositoryIsPrivate: boolean;
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

  @action
  githubUrlForFile(filename: string) {
    return `https://github.com/${this.githubRepositoryName}/blob/${this.commitSha}/${filename}`;
  }

  declare fetchFileComparisons: (this: Model, payload: unknown) => Promise<FileComparison[]>;
}

CommunityCourseStageSolutionModel.prototype.fetchFileComparisons = memberAction({
  path: 'file-comparisons',
  type: 'get',

  after(response) {
    return response.map((json: Record<string, unknown>) => FileComparisonFromJSON(json));
  },
});
