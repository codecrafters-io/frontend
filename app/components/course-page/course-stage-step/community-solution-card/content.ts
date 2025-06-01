import Component from '@glimmer/component';
import Prism from 'prismjs';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type UserModel from 'codecrafters-frontend/models/user';
import { type FileComparison, IsUnchangedFileComparison, type UnchangedFileComparison } from 'codecrafters-frontend/utils/file-comparison';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    diffSource: 'changed-files' | 'highlighted-files';
    fileComparisons: FileComparison[];
    metadataForDownvote?: Record<string, unknown>;
    metadataForUpvote?: Record<string, unknown>;
    onPublishToGithubButtonClick?: () => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCardContentComponent extends Component<Signature> {
  @tracked expandedUnchangedFilePaths: string[] = [];
  @service declare authenticator: AuthenticatorService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  get changedFilesForRender() {
    if (this.args.diffSource === 'highlighted-files') {
      return this.args.solution.changedFilesFromHighlightedFiles;
    } else {
      return this.args.solution.changedFiles;
    }
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // For now, this is only rendered in contexts where the current user is logged in
  }

  get isCurrentUserSolution() {
    return this.currentUser.id === this.args.solution.user.id;
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
    return this.args.fileComparisons.filter((fileComparison): fileComparison is UnchangedFileComparison => IsUnchangedFileComparison(fileComparison));
  }

  @action
  handleCollapseUnchangedFile(filePath: string) {
    if (this.expandedUnchangedFilePaths.includes(filePath)) {
      this.expandedUnchangedFilePaths = this.expandedUnchangedFilePaths.filter((expandedFilePath) => expandedFilePath !== filePath);
    }
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
  handleExpandUnchangedFile(filePath: string) {
    if (!this.expandedUnchangedFilePaths.includes(filePath)) {
      this.expandedUnchangedFilePaths = [...this.expandedUnchangedFilePaths, filePath];
    }
  }

  @action
  handlePublishToGithubButtonClick() {
    if (this.args.onPublishToGithubButtonClick) {
      this.args.onPublishToGithubButtonClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::Content': typeof CommunitySolutionCardContentComponent;
  }
}
