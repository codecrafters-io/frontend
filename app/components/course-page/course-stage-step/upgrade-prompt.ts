import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import moment from 'moment';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    regionalDiscount: RegionalDiscountModel;
  }
}

export default class UpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked isLarge: boolean = false;

  get featureList(): string[] {
    return [
      "No limits on content",
      "Priority support",
      "Priority Builds",
      "Community features",
    ]
  }

  @action
  onResize(entry: ResizeObserverEntry) {
    if (!entry.borderBoxSize?.[0]?.inlineSize) {
      return;
    }

    console.log(entry.borderBoxSize[0].inlineSize)
    if (entry.borderBoxSize[0].inlineSize > 640) {
      this.isLarge = true;
    } else {
      this.isLarge = false;
    }
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
