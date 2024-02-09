import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';
import type CommunityCourseStageSolutionCommentModel from 'codecrafters-frontend/models/community-course-stage-solution-comment';
import { IsUnchangedFileComparison, type FileComparison, type UnchangedFileComparison } from 'codecrafters-frontend/utils/file-comparison';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
    onPublishToGithubButtonClick?: () => void;
    isCollapsedByDefault?: boolean;
    positionInList?: number;
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

  get changedFilesForRender() {
    return this.args.solution.changedFiles.map((changedFile) => {
      return {
        ...changedFile,
        comments: this.shouldShowComments ? this.commentsGroupedByFilename[changedFile.filename] || [] : [],
      };
    });
  }

  get comments() {
    return this.args.solution.comments.filter((comment) => comment.isTopLevelComment && !comment.isNew);
  }

  get commentsGroupedByFilename() {
    return groupBy(this.comments, 'filename');
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // For now, this is only rendered in contexts where the current user is logged in
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCurrentUserSolution() {
    return this.currentUser.id === this.args.solution.user.id;
  }

  get shouldShowComments() {
    return this.comments.length > 0;
  }

  // We don't support explanations as of now
  get shouldShowExplanation() {
    // return this.isExpanded && hasExplanation && this.currentUser.isStaff;
    return false;
  }

  get shouldShowPublishToGithubButton() {
    return this.isCurrentUserSolution && !this.args.solution.isPublishedToGithub;
  }

  get unchangedFileComparisons(): UnchangedFileComparison[] {
    return this.fileComparisons.filter((fileComparison): fileComparison is UnchangedFileComparison => IsUnchangedFileComparison(fileComparison));
  }

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
    this.containerElement!.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  handleCommentView(comment: CommunityCourseStageSolutionCommentModel) {
    this.analyticsEventTracker.track('viewed_comment', {
      comment_id: comment.id,
    });
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.containerElement = element;
  }

  @action
  handleDidInsertExplanationHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateExplanationHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleExpandButtonClick() {
    this.isExpanded = true;
    this.loadComments();
    this.loadFileComparisons();

    this.analyticsEventTracker.track('viewed_community_course_stage_solution', {
      community_course_stage_solution_id: this.args.solution.id,
      position_in_list: this.args.positionInList,
    });
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
