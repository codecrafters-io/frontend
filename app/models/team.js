import Model from '@ember-data/model';
import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';

export default class TeamModel extends Model {
  @attr('number') committedSeats;
  @attr('string') inviteCode;
  @hasMany('team-membership', { async: false, inverse: 'team' }) memberships;
  @attr('string') name;
  @hasMany('team-payment-method', { async: false, inverse: 'team' }) paymentMethods;
  @hasMany('team-pilot', { async: false, inverse: 'team' }) pilots;
  @attr('string') pricingPlanType;
  @attr('string') slackAppInstallationUrl;
  @hasMany('slack-integration', { async: false, inverse: 'team' }) slackIntegrations;
  @hasMany('team-subscription', { async: false, inverse: 'team' }) subscriptions;

  @equal('pricingPlanType', 'monthly') pricingPlanTypeIsMonthly;
  @equal('pricingPlanType', 'yearly') pricingPlanTypeIsYearly;

  get activePilot() {
    return this.pilots.sortBy('endDate').reverse().findBy('isActive');
  }

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get admins() {
    return this.memberships.filterBy('isAdmin', true).mapBy('user');
  }

  get canStartSelfServeBillingFlow() {
    return this.pilots[0] || this.committedSeats;
  }

  get expiredPilot() {
    return this.pilots.sortBy('endDate').reverse().findBy('isExpired');
  }

  get hasActivePilot() {
    return !!this.activePilot;
  }

  get hasActiveSubscription() {
    return !!this.activeSubscription;
  }

  get hasExpiredPilot() {
    return !!this.expiredPilot;
  }

  get hasPaymentMethod() {
    return !!this.paymentMethods[0];
  }

  get hasSlackIntegration() {
    return !!this.slackIntegration;
  }

  get inviteUrl() {
    return `${window.location.origin}/join_team?invite_code=${this.inviteCode}`;
  }

  get members() {
    return this.memberships.mapBy('user');
  }

  get pricingFrequencyUnit() {
    return this.pricingPlanTypeIsMonthly ? 'mo' : 'yr';
  }

  get slackIntegration() {
    return this.slackIntegrations[0];
  }
}

TeamModel.prototype.fetchFirstInvoicePreview = memberAction({
  path: 'first-invoice-preview',
  type: 'get',

  after(response) {
    this.store.pushPayload(response);

    return this.store.peekRecord('invoice', response.data.id);
  },
});
