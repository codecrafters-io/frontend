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
  title: string;
  bodyMarkdown: string;
  imageUrl: string;
};

export default class ReferralFeatureCardsComponent extends Component<Signature> {
  get featureList(): Feature[] {
    return [
      {
        title: 'Generate your link in 1 click.',
        bodyMarkdown: 'Get a unique URL you can use for referring.',
        imageUrl: generateLinkImage,
      },
      {
        title: '1 week free for your friends.',
        bodyMarkdown: 'Every friend who uses your link gets 1 week free.',
        imageUrl: giftOneWeekFreeImage,
      },
      {
        title: 'Up to 1 year free for you.',
        bodyMarkdown: 'Get 1 week free for every referral, up to 52 weeks.',
        imageUrl: getOneYearFreeImage,
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralFeatureCards': typeof ReferralFeatureCardsComponent;
  }
}
