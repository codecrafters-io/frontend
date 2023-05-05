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

  async downvote() {
    if (this.currentUserUpvotes.length > 0) {
      await this.unvote();
    }

    if (this.currentUserDownvotes.length > 0) {
      return;
    }

    this.downvotesCount += 1;

    let downvote = this.store.createRecord('downvote', {
      targetId: this.id,
      targetType: this.constructor.modelName,
      user: this.currentUserService.record,
    });

    this.currentUserDownvotes.addObject(downvote);

    await downvote.save();
  },
});
