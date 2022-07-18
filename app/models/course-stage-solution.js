import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @attr('string') explanationMarkdown;
  @attr('') changedFiles; // free-form JSON
  @attr('') authorDetails; // free-form JSON
  @attr('') reviewersDetails; // free-form JSON

  get hasContributorDetails() {
    return this.authorDetails || this.reviewerDetails;
  }

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }

  // For now we only support one reviewer, might have more in the future
  get reviewerDetails() {
    return this.reviewersDetails ? this.reviewersDetails.firstObject : null;
  }
}
