import Controller from '@ember/controller';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';
import { tracked } from '@glimmer/tracking';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default class CourseAdminFeedbackController extends Controller {
  declare model: {
    feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
  };

  @tracked shouldShowAcknowledgedFeedbackSubmissions = false;

  // eslint-disable-next-line require-yield
  // @ts-ignore
  *listTransition({ insertedSprites, keptSprites, removedSprites }) {
    for (let sprite of keptSprites) {
      move(sprite);
    }

    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (let sprite of removedSprites) {
      fadeOut(sprite);
    }
  }

  get sortedFeedbackSubmissions() {
    let submissions = this.model.feedbackSubmissions;

    if (!this.shouldShowAcknowledgedFeedbackSubmissions) {
      submissions = submissions.filter((feedbackSubmission) => !feedbackSubmission.isAcknowledgedByStaff);
    }

    return submissions.sortBy('createdAt').reverse();
  }
}
