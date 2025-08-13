import Component from '@glimmer/component';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    application: InstitutionMembershipGrantApplicationModel;
    onGoBackToEnterEmail: () => void;
  };
}

export default class VerifyEmailStepContainer extends Component<Signature> {
  @action
  handleGoBackToEnterEmail() {
    this.args.onGoBackToEnterEmail();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::VerifyEmailStepContainer': typeof VerifyEmailStepContainer;
  }
}
