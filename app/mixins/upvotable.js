/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  get currentUserUpvotes() {
    return this.upvotes.filterBy('user.id', this.authenticator.currentUser.id);
  },

  get upvotes() {
    // TODO: Filter by targetType too
    return this.allUpvotes.filterBy('targetId', this.id);
  },

  get allUpvotes() {
    return this.store.peekAll('upvote');
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
      user: this.authenticator.currentUser,
    });

    await upvote.save();
  },
});
