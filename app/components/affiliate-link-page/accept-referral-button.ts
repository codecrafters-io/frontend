import Component from '@glimmer/component';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
    course?: CourseModel;
  };
}

export default class AcceptReferralButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  @tracked isCreatingAffiliateReferral = false;

  get acceptOfferButtonIsEnabled() {
    return (
      !this.isCreatingAffiliateReferral &&
      !this.currentUserIsReferrer &&
      !this.currentUserHasActiveDiscountFromAffiliateReferral &&
      !this.currentUserCanAccessMembershipBenefits
    );
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserCanAccessMembershipBenefits() {
    return this.authenticator.currentUser && this.authenticator.currentUser.canAccessMembershipBenefits;
  }

  get currentUserHasActiveDiscountFromAffiliateReferral() {
    return this.authenticator.currentUser && this.authenticator.currentUser.activeDiscountFromAffiliateReferral;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get currentUserIsReferrer() {
    if (this.authenticator.isAnonymous) {
      return false;
    } else {
      return this.args.affiliateLink.user === this.authenticator.currentUser;
    }
  }

  @action
  @waitFor
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin(null);
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingAffiliateReferral = true;

      await this.store
        .createRecord('affiliate-referral', {
          affiliateLink: this.args.affiliateLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.affiliateLink.user,
        })
        .save();

      await this.authenticator.currentUser!.fetchCurrent({}); // Refresh free usage grant columns

      if (this.args.course) {
        this.router.transitionTo('course', this.args.course.slug);
      } else {
        this.router.transitionTo('pay');
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::AcceptReferralButton': typeof AcceptReferralButtonComponent;
  }
}
