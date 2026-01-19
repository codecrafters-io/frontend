import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  claimant: belongsTo('user', { inverse: null }),
  sender: belongsTo('user', { inverse: null }),
});
