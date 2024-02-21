import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class CommentListComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked isLoading = true;
  @tracked rejectedCommentsAreExpanded = false;
  @service featureFlags;
  @service store;
  @service authenticator;

  constructor() {
    super(...arguments);

    this.loadComments();
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get rejectedComments() {
    return this.topLevelPersistedComments.filter((comment) => comment.isRejected);
  }

  get sortedComments() {
    return this.visibleComments.sortBy('score').reverse();
  }

  get topLevelPersistedComments() {
    return this.args.courseStage.comments.filter((comment) => !comment.isNew && comment.isTopLevelComment);
  }

  get visibleComments() {
    if (this.currentUser.isStaff) {
      // Include pending approval for staff users
      return this.topLevelPersistedComments.filter((comment) => !comment.isRejected || comment.user === this.authenticator.currentUser);
    } else {
      return this.topLevelPersistedComments.filter((comment) => comment.isApproved || comment.user === this.authenticator.currentUser);
    }
  }

  @action
  async loadComments() {
    this.isLoading = true;
    this.rejectedCommentsAreExpanded = false;

    await this.store.query('course-stage-comment', {
      target_id: this.args.courseStage.id,
      include:
        'user,language,target,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user,parent-comment',
      reload: true,
    });

    this.isLoading = false;
  }
}
