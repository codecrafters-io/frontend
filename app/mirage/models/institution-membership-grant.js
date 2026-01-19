import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  institution: belongsTo('institution', { inverse: null }),
  user: belongsTo('user', { inverse: 'institutionMembershipGrants' }),
});
