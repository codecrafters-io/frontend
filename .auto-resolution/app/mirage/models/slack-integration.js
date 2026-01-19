import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  team: belongsTo('team', { inverse: 'slackIntegrations' }),
});
