import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel | null;
  };
}

export default class SubmissionDetailsContainer extends Component<Signature> {
  get tabs() {
    return [
      {
        slug: 'logs',
        title: 'Logs',
        icon: 'terminal',
      },
      {
        slug: 'diff',
        title: 'Diff',
        icon: 'code',
        isGrayedOut: !!(this.args.submission && !this.args.submission.hasChangedFiles),
      },
      {
        slug: 'community_solution',
        title: 'Code Example',
        icon: 'users',
        isGrayedOut: !!(this.args.submission && !this.args.submission.communitySolution),
      },
      {
        slug: 'autofix_requests',
        title: 'Autofix',
        icon: 'sparkles',
        isGrayedOut: !!(this.args.submission && this.args.submission.autofixRequests.length === 0),
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetailsContainer': typeof SubmissionDetailsContainer;
  }
}
