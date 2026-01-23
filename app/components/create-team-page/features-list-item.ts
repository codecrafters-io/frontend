import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    description: string;
    image: string;
  };
}

export default class CreateTeamPageFeaturesListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CreateTeamPage::FeaturesListItem': typeof CreateTeamPageFeaturesListItem;
  }
}
