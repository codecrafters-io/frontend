import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    featureSlugToHighlight: Feature['slug'];
  };
}

interface Feature {
  slug: 'content' | 'turbo-test-runs' | 'anonymous-mode' | 'code-examples' | 'dark-mode';
  name: string;
  cta: string;
  isAccessibleByReferringUsers: boolean;
}

const features: Feature[] = [
  {
    slug: 'content',
    name: 'No limits on content',
    cta: 'Unlock all stages with a CodeCrafters membership. No limits.',
    isAccessibleByReferringUsers: true,
  },
  {
    slug: 'turbo-test-runs',
    name: 'Turbo test runs',
    cta: 'Get faster test runs with a CodeCrafters Membership', // unused at the moment
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'code-examples',
    name: 'Code examples',
    cta: 'Unlock all available examples with a CodeCrafters Membership.',
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'dark-mode',
    name: 'Dark mode',
    cta: 'Unlock dark mode with a CodeCrafters membership.',
    isAccessibleByReferringUsers: false,
  },
  {
    slug: 'anonymous-mode',
    name: 'Anonymous mode',
    cta: 'Get anonymous mode with a CodeCrafters Membership', // unused at the moment
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
      return `Plans start at ~~$30/month~~ $15/month (discounted price for ${
        this.regionalDiscount.countryName
      }) when billed annually. Save an additional 40% by joining within ${formatDistanceStrictWithOptions(
        {},
        new Date(),
        this.authenticator.currentUser!.earlyBirdDiscountEligibilityExpiresAt,
      )}.`;
    } else if (this.authenticator.currentUser!.isEligibleForEarlyBirdDiscount) {
      return `Plans start at $30/month when billed annually. Save 40% by joining within ${formatDistanceStrictWithOptions(
        {},
        new Date(),
        this.authenticator.currentUser!.earlyBirdDiscountEligibilityExpiresAt,
      )}.`;
    } else if (this.regionalDiscount) {
      return `Plans start at ~~$30/month~~ $15/month (discounted price for ${this.regionalDiscount.countryName}) when billed annually.`;
    } else {
      return 'Plans start at $30/month when billed annually.';
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
