import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onChangeOrResendEmailButtonClick: () => void;
  };
}

export default class EmailAlreadyInUseStepContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::EmailAlreadyInUseStepContainer': typeof EmailAlreadyInUseStepContainer;
  }
}
