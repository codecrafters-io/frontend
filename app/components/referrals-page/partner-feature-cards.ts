import Component from '@glimmer/component';
import freeForFriendImage from '/assets/images/partner-program-features/free-for-friend.jpg';
import lifetimeEarningsImage from '/assets/images/partner-program-features/lifetime-earnings.jpg';
import simplePayoutImage from '/assets/images/partner-program-features/simple-payout.jpg';

interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

type FeatureMarkdown = {
  bodyMarkdown: string;
  imageUrl: string;
  title: string;
};

export default class PartnerFeatureCardsComponent extends Component<Signature> {
  get featureMarkdownList(): FeatureMarkdown[] {
    return [
      {
        title: '60% Revenue Share.',
        bodyMarkdown:
          'Earn 60% of what we make through your referrals. Example payouts for a single paid referral (before discounting):<br /><br />\n- **$594** (lifetime plan)\n- **$216** (one year plan)\n- **$72** (3-month plan)',
        imageUrl: lifetimeEarningsImage,
      },
      {
        title: 'No forms to fill. Simple payout.',
        bodyMarkdown:
          'Activate your link with one click.<br /><br />Monitor the status of your referrals in real-time on your CodeCrafters dashboard. Get paid via PayPal or any of the 30+ gift cards that we support.',
        imageUrl: simplePayoutImage,
      },
      {
        title: '(Probably) Free for your friend.',
        bodyMarkdown:
          'Most developers can get their CodeCrafters fees fully reimbursed through their corporate L&D budget.<br /><br />Remind them about it, help them save money, and help make their decision easier.',
        imageUrl: freeForFriendImage,
      },
    ];
  }
}
