import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class JoinReferralProgramContainerComponent extends Component {
  @service store;
  @service('current-user') currentUserService;
  @tracked isCreatingReferralLink = false;

  get features() {
    return [
      {
        title: 'Easy to share',
        description: 'All you’ve got to do is share a referral link, we take care of the rest!',
        imageUrl: '/assets/images/referral-program-features/easy-to-share.png',
      },
      {
        title: 'Easy to claim',
        description: 'Get paid via PayPal, or via 30+ different types of gift cards.',
        imageUrl: '/assets/images/referral-program-features/easy-to-claim.png',
      },
      {
        title: '60% for life',
        description: `Earn 60% of earnings from every customer you refer, forever. Sky is the limit.`,
        imageUrl: '/assets/images/referral-program-features/lifetime-earnings.png',
      },
    ];
  }

  @action
  async handleGetStartedButtonClick() {
    const referralLink = this.store.createRecord('referral-link', {
      user: this.currentUserService.record,
      slug: this.currentUserService.record.username,
    });

    this.isCreatingReferralLink = true;
    await referralLink.save();
    this.isCreatingReferralLink = false;
  }
}
