import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false }) customer;
  @belongsTo('user', { async: false }) referrer;
  @belongsTo('referral-link', { async: false }) referralLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_trial', 'trial', 'paid'
}
