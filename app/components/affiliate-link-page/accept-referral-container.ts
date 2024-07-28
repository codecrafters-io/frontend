import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
  };
}

export default class AcceptReferralContainerComponent extends Component<Signature> {
  logoImage = logoImage;
}
