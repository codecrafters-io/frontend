import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
  };
};

export default class ContestPageHeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Header': typeof ContestPageHeaderComponent;
  }
}
