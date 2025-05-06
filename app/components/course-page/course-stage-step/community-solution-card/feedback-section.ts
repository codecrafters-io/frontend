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

  @tracked unsavedUserActionValue: 'upvote' | 'downvote' | null = null;

  get currentUserHasDownvoted() {
    return this.args.solution.currentUserDownvotes.length > 0;
  }

  get currentUserHasUpvoted() {
    return this.args.solution.currentUserUpvotes.length > 0;
  }

  get optimisticValueForUserAction() {
    // If the user action is not yet saved, use the unsaved value
    // Because that is the latest value
    if (this.unsavedUserActionValue !== null) {
      return this.unsavedUserActionValue;
    } else {
      return this.currentUserHasDownvoted ? 'downvote' : this.currentUserHasUpvoted ? 'upvote' : null;
    }
  }

  get optimisticValueForUserActionIsUpvote() {
    return this.optimisticValueForUserAction === 'upvote';
  }

  get optimisticValueForUserActionIsDownvote() {
    return this.optimisticValueForUserAction === 'downvote';
  }

  get optimisticValueForUserActionIsNull() {
    return this.optimisticValueForUserAction === null;
  }

  flashSuccessMessageTask = task({ restartable: true }, async () => {
    await timeout(1500);
  });

  syncUserAction = task({ keepLatest: true }, async () => {
    if (this.unsavedUserActionValue === null) {
      return;
    }

    const toggleUpvote = this.unsavedUserActionValue === 'upvote';
    const toggleDownvote = this.unsavedUserActionValue === 'downvote';

    if (toggleUpvote) {
      if (this.currentUserHasUpvoted) {
        await this.args.solution.unvote({});
      } else {
        await this.args.solution.upvote(this.args.metadataForUpvote || {});
        this.flashSuccessMessageTask.perform();
      }
    } else if (toggleDownvote) {
      if (this.currentUserHasDownvoted) {
        await this.args.solution.unvote({});
      } else {
        await this.args.solution.downvote(this.args.metadataForDownvote || {});
        this.flashSuccessMessageTask.perform();
      }
    }

    this.unsavedUserActionValue = null;
  });

  @action
  async handleClick(action: 'upvote' | 'downvote'): Promise<void> {
    this.unsavedUserActionValue = action;
    this.syncUserAction.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
