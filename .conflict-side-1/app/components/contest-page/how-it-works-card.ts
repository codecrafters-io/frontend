import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
  };
}

export default class ContestPageHowItWorksCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::HowItWorksCard': typeof ContestPageHowItWorksCard;
  }
}
