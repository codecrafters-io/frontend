import Model, { hasMany } from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubmissionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('community-course-stage-solution', { async: false }) communityCourseStageSolution;
  @belongsTo('course-tester-version', { async: false, inverse: null }) testerVersion;
  @belongsTo('repository', { async: false, inverse: 'submissions' }) repository;

  @hasMany('badge-award', { async: false }) badgeAwards;
  @hasMany('submission-evaluation', { async: false }) evaluations;

  @attr() changedFiles!: { [key: string]: string }[]; // free-form JSON
  @attr('date') createdAt!: Date;
  @attr('string') githubStorageHtmlUrl!: string;
  @attr('boolean') wasSubmittedViaCli!: boolean;
  @attr('string') status!: string;

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
