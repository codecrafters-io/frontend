import Model, { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';
import TeamMembership from './team-membership';
import TeamPaymentMethod from './team-payment-method';
import TeamPilot from './team-pilot';
import SlackIntegration from './slack-integration';
import TeamSubscription from './team-subscription';

export default class TeamModel extends Model {
  @attr('number') committedSeats!: number;
  @attr('string') inviteCode!: string;
  @hasMany('team-membership', { async: false, inverse: 'team' }) memberships!: TeamMembership[];
  @attr('string') name!: string;
  @hasMany('team-payment-method', { async: false, inverse: 'team' }) paymentMethods!: TeamPaymentMethod[];
  @hasMany('team-pilot', { async: false, inverse: 'team' }) pilots!: TeamPilot[];
  @attr('string') pricingPlanType!: string;
  @attr('string') slackAppInstallationUrl!: string;
  @hasMany('slack-integration', { async: false, inverse: 'team' }) slackIntegrations!: SlackIntegration[];
  @hasMany('team-subscription', { async: false, inverse: 'team' }) subscriptions!: TeamSubscription[];

  @equal('pricingPlanType', 'monthly') pricingPlanTypeIsMonthly!: boolean;
  @equal('pricingPlanType', 'yearly') pricingPlanTypeIsYearly!: boolean;

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

  declare fetchFirstInvoicePreview: (this: Model, payload: unknown) => Promise<void>;
}

TeamModel.prototype.fetchFirstInvoicePreview = memberAction({
  path: 'first-invoice-preview',
  type: 'get',

  after(response) {
    this.store.pushPayload(response);

    return this.store.peekRecord('invoice', response.data.id);
  },
});
