import Controller from '@ember/controller';
import type ChargeModel from 'codecrafters-frontend/models/charge';
import type { ModelType as SettingsModelType } from 'codecrafters-frontend/routes/settings';

interface BillingModelType extends SettingsModelType {
  charges: ChargeModel[];
}

export default class BillingController extends Controller {
  declare model: BillingModelType;
}
