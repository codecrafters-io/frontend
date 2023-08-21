import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import moment from 'moment';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    regionalDiscount: RegionalDiscountModel;
  }
}

export default class UpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get featureList(): string[] {
    return [
      "No limits on content",
      "Priority support",
      "Priority Builds",
      "Community features",
    ]
  }

  get secondaryCopy(): string {
    if (this.authenticator.currentUser.isEligibleForEarlyBirdDiscount && this.args.regionalDiscount) {
      return `Plans start at <s>$30/mo</s> $15/mo (discounted price for ${this.args.regionalDiscount.countryName}). Save an additional 40% by joining within the next ${moment(this.authenticator.currentUser.earlyBirdDiscountEligibilityExpiresAt).fromNow(true)}.`
    } else if (this.authenticator.currentUser.isEligibleForEarlyBirdDiscount) {
      return `Plans start at $30/mo. Save 40% by joining within the next ${moment(this.authenticator.currentUser.earlyBirdDiscountEligibilityExpiresAt).fromNow(true)}.`
    } else if (this.args.regionalDiscount) {
      return `Plans start at <s>$30/mo</s> $15/mo (discounted price for ${this.args.regionalDiscount.countryName}).`
    } else {
      return "Plans start at $30/mo."
    }
  }
}
