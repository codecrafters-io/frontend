import { action } from '@ember/object';
import Component from '@glimmer/component';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    feedbackSubmission: CourseStageFeedbackSubmissionModel;
  };
}

export default class FeedbackSubmissionListItem extends Component<Signature> {
  @action
  async handleAcknowledgeButtonClick() {
    this.args.feedbackSubmission.isAcknowledgedByStaff = true;
    await this.args.feedbackSubmission.save();
  }

  @action
  async handleUnacknowledgeButtonClick() {
    this.args.feedbackSubmission.isAcknowledgedByStaff = false;
    await this.args.feedbackSubmission.save();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::FeedbackPage::FeedbackSubmissionListItem': typeof FeedbackSubmissionListItem;
  }
}
