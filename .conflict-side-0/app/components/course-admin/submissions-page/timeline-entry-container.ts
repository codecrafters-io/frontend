import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Args: {
    submission: SubmissionModel;
    onClick: () => void;
    isSelected: boolean;
  };
}

export default class TimelineEntryContainer extends Component<Signature> {
  get autofixIconClass(): string {
    switch (this.args.submission.autofixRequests[0]!.status) {
      case 'success':
        return 'text-teal-500';
      case 'in_progress':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  }

  get formattedTimestamp(): string {
    return this.timestamp.toLocaleTimeString('en-US', { timeStyle: 'short' }).toLowerCase();
  }

  get shouldShowAutofixIcon(): boolean {
    return this.args.submission.autofixRequests.length > 0;
  }

  get timestamp(): Date {
    return this.args.submission.createdAt;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::TimelineEntryContainer': typeof TimelineEntryContainer;
  }
}
