import Model, { attr } from '@ember-data/model';

export default class PerkModel extends Model {
  @attr('string') declare claimUrl?: string;
  @attr('string') declare slug?: string;
}
