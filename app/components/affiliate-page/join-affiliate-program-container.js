import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import amazonImage from '/assets/images/company-logos/amazon-company-logo.svg';
import appleImage from '/assets/images/company-logos/apple-company-logo.svg';
import coinbaseImage from '/assets/images/company-logos/coinbase-company-logo.svg';
import figmaImage from '/assets/images/company-logos/figma-company-logo.svg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import hashiCorpImage from '/assets/images/company-logos/hashicorp-company-logo.svg';
import slackImage from '/assets/images/company-logos/slack-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';

export default class JoinAffiliateProgramContainerComponent extends Component {
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
        name: 'Figma',
        url: figmaImage,
      },
      {
        name: 'Stripe',
        url: stripeImage,
      },
      {
        name: 'Apple',
        url: appleImage,
      },
      {
        name: 'Coinbase',
        url: coinbaseImage,
      },
      {
        name: 'HashiCorp',
        url: hashiCorpImage,
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
