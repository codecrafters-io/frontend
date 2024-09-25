import Component from '@glimmer/component';
import generateLinkImage from '/assets/images/referral-program-features/generate-link.png';
import getOneYearFreeImage from '/assets/images/referral-program-features/get-one-year-free.png';
import giftOneWeekFreeImage from '/assets/images/referral-program-features/gift-one-week-free.png';

interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

type Feature = {
  imageUrl: string;
  slug: string;
  title: string;
};

export default class ReferralFeatureCardsComponent extends Component<Signature> {
  get featureList(): Feature[] {
    return [
      {
        title: 'Generate your link in 1 click.',
        imageUrl: generateLinkImage,
        slug: 'generate-link',
      },
      {
        title: '1 week free for your friends.',
        imageUrl: giftOneWeekFreeImage,
        slug: 'gift-one-week-free',
      },
      {
        title: 'Up to 1 year free for you.',
        imageUrl: getOneYearFreeImage,
        slug: 'get-one-year-free',
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralFeatureCards': typeof ReferralFeatureCardsComponent;
  }
}
