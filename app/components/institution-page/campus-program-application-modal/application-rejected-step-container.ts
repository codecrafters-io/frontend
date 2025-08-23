import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onChangeEmailButtonClick: () => void;
  };
}

export default class ApplicationRejectedStepContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::ApplicationRejectedStepContainer': typeof ApplicationRejectedStepContainer;
  }
}
