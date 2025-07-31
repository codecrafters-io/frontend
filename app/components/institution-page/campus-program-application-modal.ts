import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type InstitutionModel from 'codecrafters-frontend/models/institution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onClose: () => void;
  };
}

export default class CampusProgramApplicationModalComponent extends Component<Signature> {
  transition = fade;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CampusProgramApplicationModal': typeof CampusProgramApplicationModalComponent;
  }
}
