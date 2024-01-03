import BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import Model, { hasMany } from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubmissionEvaluationModel from 'codecrafters-frontend/models/submission-evaluation';
import { attr, belongsTo } from '@ember-data/model';
import type AutofixRequestModel from './autofix-request';

export default class SubmissionModel extends Model {
  @hasMany('autofix-request', { async: false, inverse: 'submission' }) declare autofixRequests: AutofixRequestModel[];
  @belongsTo('course-stage', { async: false, inverse: null }) declare courseStage: CourseStageModel;
  @belongsTo('community-course-stage-solution', { async: false, inverse: null })
  declare communityCourseStageSolution: CommunityCourseStageSolutionModel;
  @belongsTo('course-tester-version', { async: false, inverse: null }) declare testerVersion: CourseTesterVersionModel;
  @belongsTo('repository', { async: false, inverse: 'submissions' }) declare repository: RepositoryModel;

  @hasMany('badge-award', { async: false, inverse: 'submission' }) declare badgeAwards: BadgeAwardModel[];
  @hasMany('submission-evaluation', { async: false, inverse: 'submission' }) declare evaluations: SubmissionEvaluationModel[];

  @attr() declare changedFiles: { diff: string; filename: string }[]; // free-form JSON
  @attr('date') declare createdAt: Date;
  @attr('string') declare githubStorageHtmlUrl: string;
  @attr('boolean') declare wasSubmittedViaCli: boolean;
  @attr('string') declare status: string;

  get hasChangedFiles() {
    return this.changedFiles && this.changedFiles.length > 0;
  }

  get isRecent() {
    const now = new Date().getTime();
    const createdAt = this.createdAt.getTime();

    return now - createdAt <= 300 * 1000; // in last 5 minutes
  }

  get isSubmittedViaGit() {
    return !this.wasSubmittedViaCli;
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsFailure() {
    return this.status === 'failure';
  }

  get statusIsInternalError() {
    return this.status === 'internal_error';
  }

  get statusIsSuccess() {
    return this.status === 'success';
  }
}
