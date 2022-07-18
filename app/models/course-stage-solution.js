import { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import Model from '@ember-data/model';

export default class CourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @attr('string') explanationMarkdown;
  @attr('') changedFiles; // free-form JSON
  @attr('') authorDetails; // free-form JSON
  @attr('') reviewersDetails; // free-form JSON
  @service('current-user') currentUser;

  get hasContributorDetails() {
    // TODO: Remove this when we're ready to expose these to the world
    if (this.currentUser.isAuthenticated && this.currentUser.record.isStaff) {
      return this.authorDetails || this.reviewerDetails;
    } else {
      return false;
    }
  }

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }

  // For now we only support one reviewer, might have more in the future
  get reviewerDetails() {
    return this.reviewersDetails ? this.reviewersDetails.firstObject : null;
  }
}
