import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class CommentsTabComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked isLoading = true;
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

  @action
  async loadComments() {
    this.isLoading = true;

    await this.store.query('course-stage-comment', {
      target_id: this.args.courseStage.id,
      include:
        'user,language,target,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user,parent-comment',
      reload: true,
    });

    this.isLoading = false;
  }

  get sortedComments() {
    return this.visibleComments.sortBy('createdAt').reverse();
  }

  get visibleComments() {
    let topLevelPersistedComments = this.args.courseStage.comments.filter((comment) => !comment.isNew && comment.isTopLevelComment);

    if (this.currentUser.isStaff) {
      return topLevelPersistedComments;
    } else {
      return topLevelPersistedComments.filter((comment) => comment.isApprovedByModerator || comment.user === this.currentUserService.record);
    }
  }
}
