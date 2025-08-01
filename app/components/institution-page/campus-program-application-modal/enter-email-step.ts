import Component from '@glimmer/component';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type Store from '@ember-data/store';
import { SafeString } from 'handlebars';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type InstitutionMembershipGrantApplicationModel from 'codecrafters-frontend/models/institution-membership-grant-application';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onApplicationCreated: (application: InstitutionMembershipGrantApplicationModel) => void;
  };
}

export default class EnterEmailStepComponent extends Component<Signature> {
  @service declare store: Store;

  @tracked formElement: HTMLFormElement | undefined;
  @tracked input = '';
  @tracked isCreatingInstitutionMembershipGrantApplication = false;

  get inputIsValid(): boolean {
    return new RegExp(this.inputValidationRegex).test(this.normalizedInput);
  }

  get inputPlaceholder(): string {
    return `bill${this.args.institution.officialEmailAddressSuffixes[0]}`;
  }

  get inputValidationExplanation(): string {
    let explanation = 'Email address ending in ';

    this.args.institution.officialEmailAddressSuffixes.forEach((suffix, index) => {
      explanation += `${suffix}`;

      if (index < this.args.institution.officialEmailAddressSuffixes.length - 2) {
        explanation += ', ';
      } else if (index === this.args.institution.officialEmailAddressSuffixes.length - 2) {
        explanation += ' or ';
      }
    });

    return explanation;
  }

  get inputValidationRegex(): string {
    const escapedSuffixes = this.args.institution.officialEmailAddressSuffixes.map((suffix) => {
      return suffix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    });

    // <spaces><something>(<suffix1>|<suffix2>|...)<spaces>
    return `^ *[^@]+(${escapedSuffixes.join('|')}) *$`;
  }

  get normalizedInput(): string {
    return this.input.trim().toLowerCase();
  }

  get officialEmailAddressDescriptionHTML(): SafeString {
    let html = 'This must end in ';
    const highlightClasses = 'font-medium text-gray-500'; // Separate variable to ensure tailwind picks up these classes

    this.args.institution.officialEmailAddressSuffixes.forEach((suffix, index) => {
      html += `@<span class="${highlightClasses}">${suffix.slice(1)}</span>`;

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

    const application = await this.store
      .createRecord('institution-membership-grant-application', {
        institution: this.args.institution,
        normalizedEmailAddress: this.normalizedInput,
        originalEmailAddress: this.input,
      })
      .save();

    this.args.onApplicationCreated(application);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::EnterEmailStep': typeof EnterEmailStepComponent;
  }
}
