import Route from '@ember/routing/route';
import type ChargeModel from 'codecrafters-frontend/models/charge';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type { ModelType as SettingsModelType } from 'codecrafters-frontend/routes/settings';

interface BillingModelType extends SettingsModelType {
  charges: ChargeModel[];
}

export default class BillingRoute extends Route {
  @service declare store: Store;

  async model(): Promise<BillingModelType> {
    const user = this.modelFor('settings') as SettingsModelType;
    let charges;

    try {
      charges = await this.store.query('charge', {
        filter: { user_id: user.user.id },
      });
    } catch (error) {
      console.error('Failed to fetch charges:', error);
      charges = [];
    }

    return {
      user: user.user,
      charges: charges.toArray(),
    };
  }
}
