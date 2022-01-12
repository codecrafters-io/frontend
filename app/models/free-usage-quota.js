import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class FreeUsageQuotaModel extends Model {
  @belongsTo('user', { async: false }) user;
  @attr('string') status; // allowed values: exhausted, available
  @attr('date') resetsAt;

  get isExhausted() {
    return this.status === 'exhausted';
  }

  get isAvailable() {
    return this.status === 'available';
  }
}
