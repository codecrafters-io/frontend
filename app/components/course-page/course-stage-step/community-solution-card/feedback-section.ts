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

  @tracked lastUserActionValue: 'upvote' | 'downvote' | 'unvote' | null = null;

  get currentUserHasDownvoted() {
    return this.args.solution.currentUserDownvotes.length > 0;
  }

  get currentUserHasUpvoted() {
    return this.args.solution.currentUserUpvotes.length > 0;
  }

  get optimisticValueForUserAction() {
    if (this.lastUserActionValue !== 'unvote' && this.lastUserActionValue !== null) {
      return this.lastUserActionValue;
    }

    if (this.lastUserActionValue === 'unvote') {
      return null;
    }

    return this.currentUserHasDownvoted ? 'downvote' : this.currentUserHasUpvoted ? 'upvote' : null;
  }

  get optimisticValueForUserActionIsDownvote() {
    return this.optimisticValueForUserAction === 'downvote';
  }

  get optimisticValueForUserActionIsUpvote() {
    return this.optimisticValueForUserAction === 'upvote';
  }

  flashSuccessMessageTask = task({ keepLatest: true }, async () => {
    await timeout(500);
  });

  syncUserAction = task({ keepLatest: true }, async () => {
    const toggleUpvote = this.lastUserActionValue === 'upvote';
    const toggleDownvote = this.lastUserActionValue === 'downvote';
    const toggleUnvote = this.lastUserActionValue === 'unvote';

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
    if (this.lastUserActionValue === action) {
      this.lastUserActionValue = 'unvote';
    } else {
      this.lastUserActionValue = action;
    }

    this.syncUserAction.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
