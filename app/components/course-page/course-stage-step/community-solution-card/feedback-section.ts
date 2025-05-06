import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import fade from 'ember-animated/transitions/fade';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    metadataForDownvote?: Record<string, unknown>;
    metadataForUpvote?: Record<string, unknown>;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCardFeedbackSectionComponent extends Component<Signature> {
  transition = fade;

  @tracked unsavedUserActionValue: 'upvote' | 'downvote' | 'unvote' | null = null;

  get currentUserHasDownvoted() {
    return this.args.solution.currentUserDownvotes.length > 0;
  }

  get currentUserHasUpvoted() {
    return this.args.solution.currentUserUpvotes.length > 0;
  }

  get optimisticValueForUserAction() {
    if (this.unsavedUserActionValue !== 'unvote' && this.unsavedUserActionValue !== null) {
      return this.unsavedUserActionValue;
    }
    if (this.unsavedUserActionValue === 'unvote') {
      return null;
    }
    return this.currentUserHasDownvoted ? 'downvote' : this.currentUserHasUpvoted ? 'upvote' : null;
  }

  get optimisticValueForUserActionIsUpvote() {
    return this.optimisticValueForUserAction === 'upvote';
  }

  get optimisticValueForUserActionIsDownvote() {
    return this.optimisticValueForUserAction === 'downvote';
  }

  flashSuccessMessageTask = task({ restartable: true }, async () => {
    await timeout(1500);
  });

  syncUserAction = task({ keepLatest: true }, async () => {
    const toggleUpvote = this.unsavedUserActionValue === 'upvote';
    const toggleDownvote = this.unsavedUserActionValue === 'downvote';
    const toggleUnvote = this.unsavedUserActionValue === 'unvote';

    if (toggleUpvote) {
      this.flashSuccessMessageTask.perform();
      await this.args.solution.upvote(this.args.metadataForUpvote || {});
    } else if (toggleDownvote) {
      this.flashSuccessMessageTask.perform();
      await this.args.solution.downvote(this.args.metadataForDownvote || {});
    } else if (toggleUnvote) {
      await this.args.solution.unvote({});
    }
  });

  @action
  async handleClick(action: 'upvote' | 'downvote'): Promise<void> {
    if (this.unsavedUserActionValue === action) {
      this.unsavedUserActionValue = 'unvote';
    } else {
      this.unsavedUserActionValue = action;
    }
    this.syncUserAction.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
