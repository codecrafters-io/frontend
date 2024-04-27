import Model, { attr, belongsTo } from '@ember-data/model';

import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';

export default class CourseStageSolutionModel extends Model {
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
