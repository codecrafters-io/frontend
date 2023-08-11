import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import freeForFriendImage from '/assets/images/referral-program-features/free-for-friend.jpg';
import lifetimeEarningsImage from '/assets/images/referral-program-features/lifetime-earnings.jpg';
import simplePayoutImage from '/assets/images/referral-program-features/simple-payout.jpg';

import adobeImage from '/assets/images/company-logos/adobe-company-logo.svg';
import amazonImage from '/assets/images/company-logos/amazon-company-logo.svg';
import coinbaseImage from '/assets/images/company-logos/coinbase-company-logo.svg';
import dockerImage from '/assets/images/company-logos/docker-company-logo.svg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import linearImage from '/assets/images/company-logos/linear-company-logo.svg';
import slackImage from '/assets/images/company-logos/slack-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';

export default class JoinReferralProgramContainerComponent extends Component {
  @service store;
  @service authenticator;
  @tracked isCreatingReferralLink = false;

  get companies() {
    return [
      {
        name: 'Google',
        url: googleImage,
      },
      {
        name: 'Slack',
        url: slackImage,
      },
      {
        name: 'Amazon',
        url: amazonImage,
      },
      {
        name: 'Adobe',
        url: adobeImage,
      },
      {
        name: 'Stripe',
        url: stripeImage,
      },
      {
        name: 'Docker',
        url: dockerImage,
      },
      {
        name: 'Coinbase',
        url: coinbaseImage,
      },
      {
        name: 'Linear',
        url: linearImage,
      },
    ];
  }

  get features() {
    return [
      {
        content: {
          title: '60% Revenue Share.',
          body: ['Earn 60% of what we make through your referrals. Example payouts for a single paid referral (before discounting):'],
          list: [
            {
              amount: '$594',
              plan: 'lifetime plan',
            },
            {
              amount: '$216',
              plan: 'one year plan',
            },
            {
              amount: '$72',
              plan: '3-month plan',
            },
          ],
        },
        imageUrl: lifetimeEarningsImage,
      },
      {
        content: {
          title: 'No forms to fill. Simple payout.',
          body: [
            'Activate your link with one click.',
            'Monitor the status of your referrals in real-time on your CodeCrafters dashboard. Get paid via PayPal or any of the 30+ gift cards that we support.',
          ],
        },
        imageUrl: simplePayoutImage,
      },
      {
        content: {
          title: '(Probably) Free for your friend.',
          body: [
            'Most developers can get their CodeCrafters fees fully reimbursed through their corporate L&D budget.',
            'Remind them about it, help them save money, and help make their decision easier.',
          ],
        },
        imageUrl: freeForFriendImage,
      },
    ];
  }

  @action
  async handleGetStartedButtonClick() {
    const referralLink = this.store.createRecord('referral-link', {
      user: this.authenticator.currentUser,
      slug: this.authenticator.currentUser.username,
    });

    this.isCreatingReferralLink = true;
    await referralLink.save();
    this.isCreatingReferralLink = false;
  }
}
