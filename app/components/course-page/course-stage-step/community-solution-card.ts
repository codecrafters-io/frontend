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

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
    onPublishToGithubButtonClick?: () => void;
    onExpand?: () => void;
    metadataForUpvote?: Record<string, unknown>;
    metadataForDownvote?: Record<string, unknown>;
    isCollapsedByDefault?: boolean;
  };
};

export default class CommunitySolutionCardComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked fileComparisons: FileComparison[] = [];
  @tracked isExpanded = false;
  @tracked isLoadingComments = false;
  @tracked isLoadingFileComparisons = false;
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // For now, this is only rendered in contexts where the current user is logged in
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
    this.containerElement!.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.containerElement = element;
  }

  @action
  handleExpandButtonClick() {
    this.isExpanded = true;
    this.loadComments();
    this.loadFileComparisons();

    if (this.args.onExpand) {
      this.args.onExpand();
    }
  }

  @action
  async loadComments() {
    this.isLoadingComments = true;

    await this.store.query('community-course-stage-solution-comment', {
      target_id: this.args.solution.id,
      include:
        'user,language,target,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user,parent-comment',
      reload: true,
    });

    this.isLoadingComments = false;
  }

  @action
  async loadFileComparisons() {
    // Already loaded
    if (this.fileComparisons.length > 0) {
      return;
    }

    this.isLoadingFileComparisons = true;
    this.fileComparisons = await this.args.solution.fetchFileComparisons({});
    this.isLoadingFileComparisons = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard': typeof CommunitySolutionCardComponent;
  }
}
