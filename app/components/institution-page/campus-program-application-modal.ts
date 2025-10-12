import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type EmailAddressModel from 'codecrafters-frontend/models/email-address';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type Store from '@ember-data/store';
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
  @service declare store: Store;

  @tracked isOverridingSavedGrantApplication = false;

  transition = fade;

  get firstMatchingInstitutionalEmailAddress(): EmailAddressModel | null {
    return (
      this.authenticator.currentUser!.emailAddresses.find((emailAddress) => {
        return this.args.institution.officialEmailAddressSuffixes.some((suffix) => emailAddress.value.endsWith(suffix));
      }) || null
    );
  }

  get latestSavedGrantApplication(): InstitutionMembershipGrantApplicationModel | null {
    return (
      this.authenticator
        .currentUser!.institutionMembershipGrantApplications.filter((application) => application.institution.id === this.args.institution.id)
        .filter((application) => !application.isNew)
        .sortBy('createdAt')
        .at(-1) || null
    );
  }

  get prefilledEmailAddress(): string | undefined {
    return this.latestSavedGrantApplication?.normalizedEmailAddress || this.firstMatchingInstitutionalEmailAddress?.value;
  }

  @action
  handleChangeOrResendEmailButtonClick() {
    this.isOverridingSavedGrantApplication = true;
  }

  @action
  handleEnterEmailStepSubmitted() {
    this.isOverridingSavedGrantApplication = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal': typeof CampusProgramApplicationModal;
  }
}
