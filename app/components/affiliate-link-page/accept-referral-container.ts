import Component from '@glimmer/component';
import logomarkDark from '/assets/images/logo/logomark-dark.svg';
import logomarkLight from '/assets/images/logo/logomark-light.svg';
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
  logomarkDark = logomarkDark;
  logomarkLight = logomarkLight;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::AcceptReferralContainer': typeof AcceptReferralContainer;
  }
}
