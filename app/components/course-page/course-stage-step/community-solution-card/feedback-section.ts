import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import fade from 'ember-animated/transitions/fade';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

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

  get currentUserHasDownvoted() {
    return this.args.solution.currentUserDownvotes.length > 0;
  }

  get currentUserHasUpvoted() {
    return this.args.solution.currentUserUpvotes.length > 0;
  }

  flashSuccessMessageTask = task({ keepLatest: true }, async () => {
    // This task now only controls the visibility duration of the "Thanks" message.
    // We track its running state in the template.
    await timeout(1500);
  });

  handleUpvoteClickTask = task({ keepLatest: true }, async () => {
    if (this.currentUserHasUpvoted) {
      await this.args.solution.unvote({});
    } else {
      await this.args.solution.upvote(this.args.metadataForUpvote || {});
      this.flashSuccessMessageTask.perform();
    }
  });

  handleDownvoteClickTask = task({ keepLatest: true }, async () => {
    if (this.currentUserHasDownvoted) {
      await this.args.solution.unvote({});
    } else {
      await this.args.solution.downvote(this.args.metadataForDownvote || {});
      this.flashSuccessMessageTask.perform();
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
