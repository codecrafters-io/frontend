import Component from '@glimmer/component';
import logomarkDark from '/assets/images/logo/logomark-dark.svg';
import logomarkLight from '/assets/images/logo/logomark-light.svg';
import InstitutionModel from 'codecrafters-frontend/models/institution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    institution: InstitutionModel;
    onClaimOfferButtonClick: () => void;
  };
}

export default class ClaimOfferCard extends Component<Signature> {
  logomarkDark = logomarkDark;
  logomarkLight = logomarkLight;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::ClaimOfferCard': typeof ClaimOfferCard;
  }
}
