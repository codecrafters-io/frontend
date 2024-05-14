/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

import type UpvoteModel from 'codecrafters-frontend/models/upvote';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type DownvoteModel from 'codecrafters-frontend/models/downvote';
import type Model from '@ember-data/model';

interface Votable extends Model {
  authenticator: AuthenticatorService;
  constructor: typeof Model;
  downvotesCount: number;
  unvote: () => Promise<void>;
  upvotesCount: number;
}

export default Mixin.create({
  get allDownvotes(): DownvoteModel[] {
    return (this as unknown as Votable).store.peekAll('downvote') as unknown as DownvoteModel[];
  },

  get allUpvotes(): UpvoteModel[] {
    return (this as unknown as Votable).store.peekAll('upvote') as unknown as UpvoteModel[];
  },

  get currentUserDownvotes(): DownvoteModel[] {
    return this.downvotes.filter((downvote) => downvote.user.id === (this as unknown as Votable).authenticator.currentUser!.id);
  },

  get currentUserUpvotes(): UpvoteModel[] {
    return this.upvotes.filter((upvote) => upvote.user.id === (this as unknown as Votable).authenticator.currentUser!.id);
  },

  get downvotes(): DownvoteModel[] {
    // TODO: Filter by targetType too
    return this.allDownvotes.filter((downvote) => downvote.targetId === (this as unknown as Votable).id);
  },

  get upvotes(): UpvoteModel[] {
    // TODO: Filter by targetType too
    return this.allUpvotes.filter((upvote) => upvote.targetId === (this as unknown as Votable).id);
  },

  async downvote() {
    if (this.currentUserUpvotes.length > 0) {
      await (this as unknown as Votable).unvote();
    }

    if (this.currentUserDownvotes.length > 0) {
      return;
    }

    (this as unknown as Votable).downvotesCount += 1;

    const downvote = (this as unknown as Votable).store.createRecord('downvote', {
      targetId: (this as unknown as Votable).id,
      targetType: (this as unknown as Votable).constructor.modelName,
      user: (this as unknown as Votable).authenticator.currentUser,
    });

    await downvote.save();
  },

  async upvote(): Promise<void> {
    if (this.currentUserDownvotes.length > 0) {
      await (this as unknown as Votable).unvote();
    }

    if (this.currentUserUpvotes.length > 0) {
      return;
    }

    (this as unknown as Votable).upvotesCount += 1;

    const upvote = (this as unknown as Votable).store.createRecord('upvote', {
      targetId: (this as unknown as Votable).id,
      targetType: (this as unknown as Votable).constructor.modelName,
      user: (this as unknown as Votable).authenticator.currentUser,
    });

    await upvote.save();
  },
});
