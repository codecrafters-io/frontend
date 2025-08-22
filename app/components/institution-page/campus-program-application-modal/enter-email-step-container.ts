import Component from '@glimmer/component';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type Store from '@ember-data/store';
import { SafeString } from 'handlebars';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onSubmit: () => void;
    prefilledEmailAddress?: string;
  };
}

export default class EnterEmailStepContainer extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked formElement: HTMLFormElement | undefined;
  @tracked input = '';
  @tracked isCreatingInstitutionMembershipGrantApplication = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.input = args.prefilledEmailAddress || '';
  }

  get inputIsValid(): boolean {
    return this.args.institution.officialEmailAddressSuffixes.some((suffix) => this.normalizedInput.endsWith(suffix));
  }

  get inputPlaceholder(): string {
    const suffix = this.args.institution.officialEmailAddressSuffixes[0]!;

    if (suffix[0] === '.') {
      return `bill@*${suffix}`; // e.g. bill@*iitrpr.ac.in
    } else if (suffix[0] === '@') {
      return `bill${suffix}`; // e.g. bill@iitrpr.ac.in
    } else {
      throw new Error(`Invalid suffix: ${suffix}, must start with @ or .`);
    }
  }

  get inputValidationExplanation(): string {
    let explanation = 'Email address ending in ';

    this.args.institution.officialEmailAddressSuffixes.forEach((suffix, index) => {
      if (suffix[0] === '.') {
        explanation += `@*${suffix}`; // e.g. @*.iitrpr.ac.in
      } else if (suffix[0] === '@') {
        explanation += suffix; // e.g. @iitrpr.ac.in
      } else {
        throw new Error(`Invalid suffix: ${suffix}, must start with @ or .`);
      }

      if (index < this.args.institution.officialEmailAddressSuffixes.length - 2) {
        explanation += ', ';
      } else if (index === this.args.institution.officialEmailAddressSuffixes.length - 2) {
        explanation += ' or ';
      }
    });

    return explanation;
  }

  get inputValidationRegex(): string {
    // We have a user-facing explanation for the regex, this dummy regex just ensures that the browser displays the explanation
    return this.inputIsValid ? '.*' : 'will-never-match-any-string^';
  }

  get normalizedInput(): string {
    return this.input.trim().toLowerCase();
  }

  get officialEmailAddressDescriptionHTML(): SafeString {
    let html = 'This must end in ';
    const highlightClasses = 'font-medium text-gray-500'; // Separate variable to ensure tailwind picks up these classes

    this.args.institution.officialEmailAddressSuffixes.forEach((suffix, index) => {
      if (suffix[0] === '@') {
        html += `@<span class="${highlightClasses}">${suffix.slice(1)}</span>`; // e.g. @iitrpr.ac.in
      } else if (suffix[0] === '.') {
        html += `@<span class="${highlightClasses}">*${suffix}</span>`; // e.g. @*.iitrpr.ac.in
      } else {
        throw new Error(`Invalid suffix: ${suffix}, must start with @ or .`);
      }

      if (index < this.args.institution.officialEmailAddressSuffixes.length - 2) {
        html += ', ';
      } else if (index === this.args.institution.officialEmailAddressSuffixes.length - 2) {
        html += ' or ';
      }
    });

    html += '.';

    return htmlSafe(html);
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement) {
    this.formElement = formElement;
  }

  @action
  async handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();

    this.formElement!.reportValidity();

    if (!this.formElement!.checkValidity()) {
      this.input = this.normalizedInput; // Reset any formatting differences (e.g. spaces)

      return;
    }

    this.isCreatingInstitutionMembershipGrantApplication = true;

    await this.store
      .createRecord('institution-membership-grant-application', {
        institution: this.args.institution,
        normalizedEmailAddress: this.normalizedInput,
        originalEmailAddress: this.input,
        user: this.authenticator.currentUser!,
      })
      .save();

    this.isCreatingInstitutionMembershipGrantApplication = false;

    // Sync current user to get the latest application data
    await this.authenticator.syncCurrentUser();

    this.args.onSubmit();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::EnterEmailStepContainer': typeof EnterEmailStepContainer;
  }
}
