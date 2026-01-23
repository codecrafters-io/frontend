import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class TeamPageSection extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::Section': typeof TeamPageSection;
  }
}
