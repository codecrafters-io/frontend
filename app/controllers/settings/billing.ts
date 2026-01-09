import { action } from '@ember/object';
import { service } from '@ember/service';
import Controller from '@ember/controller';
import type { ModelType as SettingsModelType } from 'codecrafters-frontend/routes/settings';
import { tracked } from '@glimmer/tracking';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import { task } from 'ember-concurrency';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';

export default class BillingController extends Controller {
  declare model: SettingsModelType;

  queryParams = ['action'];

  @service declare router: RouterService;
  @service declare store: Store;

  @tracked action: string | undefined = undefined;
  @tracked chooseMembershipPlanModalIsOpen: boolean = false;
  @tracked regionalDiscount: RegionalDiscountModel | null = null;
  @tracked shouldShowMembershipExtendedNotice: boolean = false;

  loadRegionalDiscountTask = task({ keepLatest: true }, async () => {
    this.regionalDiscount = await this.store.createRecord('regional-discount').fetchCurrent();
  });

  @action
  async handleDidInsert() {
    this.shouldShowMembershipExtendedNotice = false;

    await this.loadRegionalDiscountTask.perform();

    if (this.action === 'membership_extended') {
      this.shouldShowMembershipExtendedNotice = true;
      this.router.transitionTo({ queryParams: { action: null } });
    }
  }

  @action
  handleDismissNotice() {
    this.shouldShowMembershipExtendedNotice = false;
  }
}
