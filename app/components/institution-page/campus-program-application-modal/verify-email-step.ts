import Component from '@glimmer/component';
import type InstitutionModel from 'codecrafters-frontend/models/institution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
  };
}

export default class VerifyEmailStepComponent extends Component<Signature> {
  get fieldDescriptionHTML(): string {
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

    return html;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal::VerifyEmailStep': typeof VerifyEmailStepComponent;
  }
}
