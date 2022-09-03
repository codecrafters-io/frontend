import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class TeamModel extends Model {
  @attr('number') committedSeats;
  @attr('string') inviteCode;
  @hasMany('team-membership', { async: false }) memberships;
  @attr('string') name;
  @hasMany('team-payment-method', { async: false }) paymentMethods;
  @hasMany('team-pilot', { async: false }) pilots;
  @attr('string') slackAppInstallationUrl;
  @hasMany('slack-integration', { async: false }) slackIntegrations;
  @hasMany('team-subscription', { async: false }) subscriptions;

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
    return this.pilots.firstObject || this.committedSeats;
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
    return !!this.paymentMethods.firstObject;
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

  get slackIntegration() {
    return this.slackIntegrations.firstObject;
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
