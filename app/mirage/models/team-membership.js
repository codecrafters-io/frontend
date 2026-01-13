import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: 'teamMemberships' }),
  team: belongsTo('team', { inverse: 'memberships' }),
});
