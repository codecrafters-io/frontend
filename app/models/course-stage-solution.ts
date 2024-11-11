import Model, { attr, belongsTo } from '@ember-data/model';
import { service } from '@ember/service';
import ViewableMixin from 'codecrafters-frontend/mixins/viewable'; // eslint-disable-line ember/no-mixins
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';

export default class CourseStageSolutionModel extends Model.extend(ViewableMixin) {
  @service declare authenticator: AuthenticatorService;

  @attr() declare authorDetails: { [key: string]: string }; // free-form JSON
  @attr() declare changedFiles: { diff: string; filename: string }[]; // free-form JSON
  @attr('string') declare explanationMarkdown: string;
  @attr() declare reviewersDetails: Array<{ [key: string]: string }>; // free-form JSON

  @belongsTo('course-stage', { async: false, inverse: 'solutions' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  get hasContributorDetails() {
    return this.authorDetails || (this.reviewersDetails && this.reviewersDetails[0]);
  }

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }
}
