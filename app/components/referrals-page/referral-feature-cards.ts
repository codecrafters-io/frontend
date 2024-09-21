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
  bodyMarkdown: string;
  imageUrl: string;
  popover?: { targetId: string; html: string };
  title: string;
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
        bodyMarkdown: 'Each referral gets 1 week of <u id="popover-target-friends" class="decoration-dotted">paid content access</u>.',
        imageUrl: giftOneWeekFreeImage,
        popover: {
          targetId: 'popover-target-friends',
          html: 'Includes all stages from paid challenges, but excludes other membership benefits like dark mode, turbo test runs etc. <a href="https://docs.codecrafters.io/membership/content" class="underline">Learn more</a>',
        },
      },
      {
        title: 'Up to 1 year free for you.',
        bodyMarkdown: '1 week of <u id="popover-target-you" class="decoration-dotted">paid content access</u> per referral. Up to 52 weeks.',
        imageUrl: getOneYearFreeImage,
        popover: {
          targetId: 'popover-target-you',
          html: 'Includes all stages from paid challenges, but excludes other membership benefits like dark mode, turbo test runs etc. <a href="https://docs.codecrafters.io/membership/content" class="underline">Learn more</a>',
        },
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralFeatureCards': typeof ReferralFeatureCardsComponent;
  }
}
