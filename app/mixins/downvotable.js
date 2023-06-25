/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  get currentUserDownvotes() {
    return this.downvotes.filterBy('user.id', this.authenticator.currentUser.id);
  },

  get downvotes() {
    // TODO: Filter by targetType too
    return this.allDownvotes.filterBy('targetId', this.id);
  },

  get allDownvotes() {
    return this.store.peekAll('downvote');
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
      user: this.authenticator.currentUser,
    });

    await downvote.save();
  },
});
