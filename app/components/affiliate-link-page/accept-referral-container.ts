import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
    course?: CourseModel;
    verticalSize: 'tall' | 'compact';
  };
}

export default class AcceptReferralContainerComponent extends Component<Signature> {
  logoImage = logoImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::AcceptReferralContainer': typeof AcceptReferralContainerComponent;
  }
}
