import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel | null;
  };
}

export default class SubmissionDetailsContainerComponent extends Component<Signature> {
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
      },
      {
        slug: 'community_solution',
        title: 'Code Example',
        icon: 'users',
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetailsContainer': typeof SubmissionDetailsContainerComponent;
  }
}
