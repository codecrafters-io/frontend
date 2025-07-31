import Component from '@glimmer/component';
import codeCraftersLogoImage from '/assets/images/logo/logomark-color.svg';
import InstitutionModel from 'codecrafters-frontend/models/institution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onClaimOfferButtonClick: () => void;
  };
}

export default class ClaimOfferCardComponent extends Component<Signature> {
  codeCraftersLogoImage = codeCraftersLogoImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::ClaimOfferCard': typeof ClaimOfferCardComponent;
  }
}
