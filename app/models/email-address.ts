import Model, { attr } from '@ember-data/model';

export default class EmailAddressModel extends Model {
  @attr('string') declare value: string;
}
