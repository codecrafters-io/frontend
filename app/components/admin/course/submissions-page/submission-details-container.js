import Component from '@glimmer/component';

export default class SubmissionDetailsContainerComponent extends Component {
  get tabs() {
    return [
      {
        slug: 'diff',
        title: 'Diff',
        icon: 'code',
      },
      {
        slug: 'logs',
        title: 'Logs',
        icon: 'terminal',
      },
      {
        slug: 'community_solution',
        title: 'Community Solution',
        icon: 'users',
      },
    ];
  }
}
