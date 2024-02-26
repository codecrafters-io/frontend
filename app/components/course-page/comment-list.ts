import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';

type Signature = {
  Args: {
    courseStage: CourseStageModel;
    language: LanguageModel | null;
  };
};

export default class CommentListComponent extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @tracked isLoading = true;
  @tracked rejectedCommentsAreExpanded = false;

  @service declare featureFlags: FeatureFlagsService;
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.loadComments();
  }

  get currentUser(): UserModel {
    return this.authenticator.currentUser as UserModel; // Currently, this is only shown in pages with auth enabled
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
