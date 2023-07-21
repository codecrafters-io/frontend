import Component from '@glimmer/component';

export default class SubmissionDetailsContainerComponent extends Component {
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
