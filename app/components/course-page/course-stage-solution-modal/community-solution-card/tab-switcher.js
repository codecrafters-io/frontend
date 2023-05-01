import Component from '@glimmer/component';

export default class TabSwitcherComponent extends Component {
  get tabs() {
    return [
      {
        title: 'Diff',
        id: 'diff',
        isCurrent: this.args.currentTab === 'diff',
      },
      {
        title: 'Explanation',
        id: 'explanation',
        isCurrent: this.args.currentTab === 'explanation',
      },
    ];
  }
}
