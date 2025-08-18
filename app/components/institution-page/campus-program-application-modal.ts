import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onClose: () => void;
  };
}

export default class CampusProgramApplicationModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  
  @tracked shouldShowEnterEmail = false;

  transition = fade;

  get latestSavedGrantApplication(): InstitutionMembershipGrantApplicationModel | null {
    return (
      this.authenticator
        .currentUser!.institutionMembershipGrantApplications.filter((application) => application.institution.id === this.args.institution.id)
        .reject((application) => application.isNew)
        .sortBy('createdAt').lastObject || null
    );
  }

  @action
  handleEnterEmailStepSubmitted() {
    this.shouldShowEnterEmail = false;
  }

  @action
  handleChangeOrResendEmailButtonClick() {
    this.latestSavedGrantApplication!.unloadRecord();
    this.shouldShowEnterEmail = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal': typeof CampusProgramApplicationModal;
  }
}
