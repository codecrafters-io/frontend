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

  async upvote() {
    if (this.currentUserDownvotes.length > 0) {
      await this.unvote();
    }

    if (this.currentUserUpvotes.length > 0) {
      return;
    }

    this.upvotesCount += 1;

    let upvote = this.store.createRecord('upvote', {
      targetId: this.id,
      targetType: this.constructor.modelName,
      user: this.currentUserService.record,
    });

    this.currentUserUpvotes.addObject(upvote);

    await upvote.save();
  },
});
