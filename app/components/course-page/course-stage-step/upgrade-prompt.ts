import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import moment from 'moment';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import showdown from 'showdown';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { SafeString } from '@ember/template/-private/handlebars';
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

  convertToHTML(markdown: string): SafeString {
    return htmlSafe(
      new showdown.Converter({ strikethrough: true }).makeHtml(markdown),
    );
  }

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

    if (entry.borderBoxSize[0].inlineSize > 680) {
      this.isLarge = true;
    } else {
      this.isLarge = false;
    }
  }

  get secondaryCopy(): SafeString {
    if (this.authenticator.currentUser.isEligibleForEarlyBirdDiscount && this.args.regionalDiscount) {
      return this.convertToHTML(`Plans start at ~~$30/mo~~ $15/mo (discounted price for ${this.args.regionalDiscount.countryName}). Save an additional 40% by joining within the next ${moment(this.authenticator.currentUser.earlyBirdDiscountEligibilityExpiresAt).fromNow(true)}.`)
    } else if (this.authenticator.currentUser.isEligibleForEarlyBirdDiscount) {
      return this.convertToHTML(`Plans start at $30/mo. Save 40% by joining within the next ${moment(this.authenticator.currentUser.earlyBirdDiscountEligibilityExpiresAt).fromNow(true)}.`)
    } else if (this.args.regionalDiscount) {
      return this.convertToHTML(`Plans start at <s>$30/mo</s> $15/mo (discounted price for ${this.args.regionalDiscount.countryName}).`)
    } else {
      return this.convertToHTML("Plans start at $30/mo.")
    }
  }
}
