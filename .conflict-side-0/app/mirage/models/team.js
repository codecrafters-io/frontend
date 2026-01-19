import { Model, hasMany } from 'miragejs';

export default Model.extend({
  slackIntegrations: hasMany('slack-integration', { inverse: 'team' }),
  memberships: hasMany('team-membership', { inverse: 'team' }),
  paymentMethods: hasMany('team-payment-method', { inverse: 'team' }),
  pilots: hasMany('team-pilot', { inverse: 'team' }),
  subscriptions: hasMany('team-subscription', { inverse: 'team' }),
});
