/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  get currentUserDownvotes() {
    return this.store.peekAll('downvote').filterBy('targetId', this.id).filterBy('user.id', this.currentUserService.record.id);
  },

  get downvotes() {
    // TODO: Filter by targetType too
    return this.store.peekAll('downvote').filterBy('targetId', this.id);
  },
});
