import Controller from '@ember/controller';
import { action } from '@ember/object';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/manage';

export default class GiftsManageController extends Controller {
  declare model: ModelType;

  @action
  async handleCopyButtonClick() {
    await navigator.clipboard.writeText(this.model.gift.redeemUrl);
  }
}
