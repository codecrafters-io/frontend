import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
  @tracked isCreatingAffiliateLink = false;

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

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  async handleGetStartedButtonClick() {
    if (!this.currentUser.isAffiliate) {
      return;
    }

    const affiliateLink = this.store.createRecord('affiliate-link', {
      user: this.currentUser,
      slug: this.currentUser.username,
    });

    this.isCreatingAffiliateLink = true;
    await affiliateLink.save();
    this.isCreatingAffiliateLink = false;
  }
}
