import Model, { attr, belongsTo } from '@ember-data/model';

export default class CourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'solutions' }) courseStage;
  @belongsTo('language', { async: false, inverse: null }) language;
  @attr('string') explanationMarkdown;
  @attr('') changedFiles; // free-form JSON
  @attr('') authorDetails; // free-form JSON
  @attr('') reviewersDetails; // free-form JSON

  get hasContributorDetails() {
    return this.authorDetails || (this.reviewersDetails && this.reviewersDetails.firstObject);
  }

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }
}
