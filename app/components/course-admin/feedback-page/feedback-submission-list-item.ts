import Component from '@glimmer/component';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';

type Signature = {
  Args: {
    feedbackSubmission: CourseStageFeedbackSubmissionModel; // Replace 'any' with the actual type of feedbackSubmission
  };
};

export default class FeedbackSubmissionListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::FeedbackPage::FeedbackSubmissionListItem': typeof FeedbackSubmissionListItemComponent;
  }
}
