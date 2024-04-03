import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Args: {
    submission: SubmissionModel;
    onClick: () => void;
    isSelected: boolean;
  };
}

export default class TimelineEntryContainerComponent extends Component<Signature> {
  get formattedTimestamp(): string {
    return this.timestamp.toLocaleTimeString('en-US', { timeStyle: 'short' }).toLowerCase();
  }

  get timestamp(): Date {
    return this.args.submission.createdAt;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::TimelineEntryContainer': typeof TimelineEntryContainerComponent;
  }
}
