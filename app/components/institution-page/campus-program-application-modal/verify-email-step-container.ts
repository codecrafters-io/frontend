import Component from '@glimmer/component';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    application: InstitutionMembershipGrantApplicationModel;
    onChangeOrResendEmailButtonClick: () => void;
  };
}

export default class VerifyEmailStepContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::VerifyEmailStepContainer': typeof VerifyEmailStepContainer;
  }
}
