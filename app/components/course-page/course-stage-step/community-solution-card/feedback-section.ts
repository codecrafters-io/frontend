import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import fade from 'ember-animated/transitions/fade';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { service } from '@ember/service';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
    metadata?: Record<string, unknown>;
  };
}

export default class CommunitySolutionCardFeedbackSectionComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

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

  handleUpvoteClickTask = task(async () => {
    if (this.currentUserHasUpvoted) {
      await this.args.solution.unvote({}); // Pass metadata if needed
      // Don't flash message on unvote
    } else {
      await this.args.solution.upvote({}); // Pass metadata if needed
      this.flashSuccessMessageTask.perform();
      this.analyticsEventTracker.track('voted_on_community_solution', {
        community_course_stage_solution_id: this.args.solution.id,
        vote_type: 'upvote',
        unvoted: false,
        // ...(this.args.metadataForUpvote || {}),
      });
    }
  });

  handleDownvoteClickTask = task(async () => {
    if (this.currentUserHasDownvoted) {
      await this.args.solution.unvote({}); // Pass metadata if needed
      // Don't flash message on unvote
    } else {
      await this.args.solution.downvote({}); // Pass metadata if needed
      this.flashSuccessMessageTask.perform();
      this.analyticsEventTracker.track('voted_on_community_solution', {
        community_course_stage_solution_id: this.args.solution.id,
        vote_type: 'downvote',
        unvoted: false,
        // ...(this.args.metadataForDownvote || {}),
      });
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
