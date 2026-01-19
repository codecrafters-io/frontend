import { Model, hasMany } from 'miragejs';

export default Model.extend({
  currentUserAwards: hasMany('badge-award', { inverse: null }),
});
