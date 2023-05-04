/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  get currentUserUpvotes() {
    return this.store.peekAll('upvote').filterBy('targetId', this.id).filterBy('user.id', this.currentUserService.record.id);
  },

  get upvotes() {
    // TODO: Filter by targetType too
    return this.store.peekAll('upvote').filterBy('targetId', this.id);
  },
});
