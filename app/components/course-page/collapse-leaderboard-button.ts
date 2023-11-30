import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;
}

export default class CollapseLeaderboardButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CollapseLeaderboardButton': typeof CollapseLeaderboardButtonComponent;
  }
}
