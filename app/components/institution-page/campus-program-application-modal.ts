import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import { action } from '@ember/object';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onClose: () => void;
  };
}

export default class CampusProgramApplicationModalComponent extends Component<Signature> {
  transition = fade;

  @tracked application: InstitutionMembershipGrantApplicationModel | null = null;
  @tracked currentStep = 'enter-email'; // enter-email, verify-email, grant-approved

  @action
  handleApplicationCreated(application: InstitutionMembershipGrantApplicationModel) {
    this.application = application;
    this.currentStep = 'verify-email';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal': typeof CampusProgramApplicationModalComponent;
  }
}
