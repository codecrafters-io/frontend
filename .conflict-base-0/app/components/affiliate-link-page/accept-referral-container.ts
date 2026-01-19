import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
    course?: CourseModel;
    language?: LanguageModel;
    verticalSize: 'tall' | 'compact';
  };
}

export default class AcceptReferralContainer extends Component<Signature> {
  logoImage = logoImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::AcceptReferralContainer': typeof AcceptReferralContainer;
  }
}
