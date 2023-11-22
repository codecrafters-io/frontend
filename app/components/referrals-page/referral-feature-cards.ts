import Component from '@glimmer/component';
import generateLinkImage from '/assets/images/referral-program-features/generate-link.png';
import getOneYearFreeImage from '/assets/images/referral-program-features/get-one-year-free.png';
import giftOneWeekFreeImage from '/assets/images/referral-program-features/gift-one-week-free.png';

interface Signature {
  Element: HTMLElement;

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
        bodyMarkdown: 'Refer friends with a unique URL.',
        imageUrl: generateLinkImage,
      },
      {
        title: '1 week free for your friends.',
        bodyMarkdown: 'Each referral gets 1 week free.',
        imageUrl: getOneYearFreeImage,
      },
      {
        title: 'Up to 1 year free for you.',
        bodyMarkdown: '1 week free per referral. Up to 52 weeks.',
        imageUrl: giftOneWeekFreeImage,
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralFeatureCards': typeof ReferralFeatureCardsComponent;
  }
}
