import Controller from '@ember/controller';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';

export default class CourseAdminFeedbackController extends Controller {
  declare model: {
    feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
  };

  get acknowledgedFeedbackSubmissions() {
    return this.model.feedbackSubmissions
      .filter((feedbackSubmission) => feedbackSubmission.isAcknowledgedByStaff)
      .sortBy('createdAt')
      .reverse();
  }

  get tabs() {
    return [
      {
        slug: 'unacknowledged',
        title: 'Unacknowledged',
      },
      {
        slug: 'acknowledged',
        title: 'Acknowledged',
      },
    ];
  }

  get unacknowledgedFeedbackSubmissions() {
    return this.model.feedbackSubmissions
      .filter((feedbackSubmission) => !feedbackSubmission.isAcknowledgedByStaff)
      .sortBy('createdAt')
      .reverse();
  }
}
