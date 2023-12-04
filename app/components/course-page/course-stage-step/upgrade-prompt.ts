import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
}

export default class UpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isLarge: boolean = false;
  @tracked isLoadingRegionalDiscount: boolean = true;
  @tracked regionalDiscount: RegionalDiscountModel | null = null;

  get featureList(): string[] {
    return ['No limits on content', 'Priority support', 'Priority Builds', 'Community features'];
  }

  get secondaryCopyMarkdown(): string {
    if (this.authenticator.currentUser!.isEligibleForEarlyBirdDiscount && this.regionalDiscount) {
      return `Plans start at ~~$40/mo~~ $20/mo (discounted price for ${
        this.regionalDiscount.countryName
      }). Save an additional 40% by joining within ${formatDistanceStrictWithOptions(
        {},
        new Date(),
        this.authenticator.currentUser!.earlyBirdDiscountEligibilityExpiresAt,
      )}.`;
    } else if (this.authenticator.currentUser!.isEligibleForEarlyBirdDiscount) {
      return `Plans start at $40/mo. Save 40% by joining within ${formatDistanceStrictWithOptions(
        {},
        new Date(),
        this.authenticator.currentUser!.earlyBirdDiscountEligibilityExpiresAt,
      )}.`;
    } else if (this.regionalDiscount) {
      return `Plans start at ~~$40/mo~~ $20/mo (discounted price for ${this.regionalDiscount.countryName}).`;
    } else {
      return 'Plans start at $40/mo.';
    }
  }

  @action
  async handleDidInsert(): Promise<void> {
    this.regionalDiscount = await this.store.createRecord('regional-discount').fetchCurrent();
    this.isLoadingRegionalDiscount = false;
  }

  @action
  onResize(entry: ResizeObserverEntry): void {
    if (!entry.borderBoxSize?.[0]?.inlineSize) {
      return;
    }

    if (entry.borderBoxSize[0].inlineSize > 680) {
      this.isLarge = true;
    } else {
      this.isLarge = false;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::UpgradePrompt': typeof UpgradePromptComponent;
  }
}
