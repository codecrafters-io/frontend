/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { hasMany } from '@ember-data/model';

export default Mixin.create({
  downvotes: hasMany('downvote', { inverse: 'downvotable' }),
});
