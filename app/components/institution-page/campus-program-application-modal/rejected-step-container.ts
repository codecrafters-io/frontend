import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onChangeOrResendEmailButtonClick: () => void;
  };
}

export default class RejectedStepContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::RejectedStepContainer': typeof RejectedStepContainer;
  }
}
