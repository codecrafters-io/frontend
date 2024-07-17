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

  Args: {
    featureSlugToHighlight: Feature['slug'];
  };
}

interface Feature {
  slug: 'content' | 'turbo-test-runs' | 'anonymous-mode' | 'code-examples' | 'perks';
  name: string;
  cta: string;
  isAccessibleByReferringUsers: boolean;
}

const features: Feature[] = [
  {
    slug: 'content',
    name: 'No limits on content',
    cta: 'This stage requires a CodeCrafters Membership',
    isAccessibleByReferringUsers: true,
  },
  {
    slug: 'turbo-test-runs',
    name: 'Turbo test runs',
    cta: 'Get faster test runs with a CodeCrafters Membership',
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'anonymous-mode',
    name: 'Anonymous mode',
    cta: 'Get anonymous mode with a CodeCrafters Membership',
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'code-examples',
    name: 'More code examples',
    cta: 'View more code examples with a CodeCrafters Membership',
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'perks',
    name: 'Access to Perks',
    cta: 'Access perks with a CodeCrafters membership',
    isAccessibleByReferringUsers: false,
  },
];

export default class UpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isLoadingRegionalDiscount: boolean = true;
  @tracked regionalDiscount: RegionalDiscountModel | null = null;

  get featureToHighlight(): Feature {
    return features.find((feature) => feature.slug === this.args.featureSlugToHighlight)!;
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

  get sortedFeatureList(): Feature[] {
    return [this.featureToHighlight, ...features.filter((feature) => feature.slug !== this.args.featureSlugToHighlight)];
  }

  @action
  async handleDidInsert(): Promise<void> {
    this.regionalDiscount = await this.store.createRecord('regional-discount').fetchCurrent();
    this.isLoadingRegionalDiscount = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::UpgradePrompt': typeof UpgradePromptComponent;
  }
}
