import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type UserModel from 'codecrafters-frontend/models/user';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { type FileComparison } from 'codecrafters-frontend/utils/file-comparison';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isExpanded: boolean;
    metadataForDownvote?: Record<string, unknown>;
    metadataForUpvote?: Record<string, unknown>;
    onExpandButtonClick?: (containerElement: HTMLDivElement) => void;
    onPublishToGithubButtonClick?: () => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCardComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked fileComparisons: FileComparison[] = [];
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // For now, this is only rendered in contexts where the current user is logged in
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.containerElement = element;

    // Trigger comments, expand event etc.
    if (this.args.isExpanded) {
      this.loadAsyncResources.perform();
    }
  }

  @action
  handleDidUpdateIsExpanded(_div: HTMLDivElement, [isExpanded]: [boolean]) {
    if (isExpanded) {
      this.loadAsyncResources.perform();
    }
  }

  @action
  handleExpandButtonClick() {
    if (this.args.onExpandButtonClick) {
      this.args.onExpandButtonClick(this.containerElement!);
    }

    this.loadAsyncResources.perform();
  }

  loadComments = task(async () => {
    await this.store.query('community-course-stage-solution-comment', {
      target_id: this.args.solution.id,
      include:
        'user,language,target,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user,parent-comment',
      reload: true,
    });
  });

  loadFileComparisons = task(async () => {
    // Already loaded
    if (this.fileComparisons.length > 0) {
      return;
    }

    this.fileComparisons = await this.args.solution.fetchFileComparisons({});
  });

  loadAsyncResources = task({ keepLatest: true }, async () => {
    await Promise.all([this.loadComments.perform(), this.loadFileComparisons.perform()]);
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard': typeof CommunitySolutionCardComponent;
  }
}
