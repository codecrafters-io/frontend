import Controller from '@ember/controller';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';
import { tracked } from '@glimmer/tracking';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseAdminFeedbackController extends Controller {
  declare model: {
    feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
  };

  @tracked shouldShowAcknowledgedFeedbackSubmissions = false;

  get sortedFeedbackSubmissions() {
    let submissions = this.model.feedbackSubmissions;

    if (!this.shouldShowAcknowledgedFeedbackSubmissions) {
      submissions = submissions.filter((feedbackSubmission) => !feedbackSubmission.isAcknowledgedByStaff);
    }

    submissions = submissions.filter((feedbackSubmission) => feedbackSubmission.status !== 'open');

    return submissions.toSorted(fieldComparator('createdAt')).reverse();
  }

  // @ts-expect-error ember-animated not typed
  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites, keptSprites, removedSprites }) {
    for (const sprite of keptSprites) {
      move(sprite);
    }

    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (const sprite of removedSprites) {
      fadeOut(sprite);
    }
  }
}
