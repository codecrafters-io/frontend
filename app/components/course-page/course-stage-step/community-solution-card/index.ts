import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { type FileComparison } from 'codecrafters-frontend/utils/file-comparison';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isExpanded: boolean;
    metadataForDownvote?: Record<string, unknown>;
    metadataForUpvote?: Record<string, unknown>;
    onCollapseButtonClick?: (containerElement: HTMLDivElement) => void;
    onExpandButtonClick?: (containerElement: HTMLDivElement) => void;
    onPublishToGithubButtonClick?: () => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCard extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked diffSource: 'changed-files' | 'highlighted-files' = 'changed-files';
  @tracked fileComparisons: FileComparison[] = [];
  @service declare authenticator: AuthenticatorService;
  get currentUser() {
    return this.authenticator.currentUser as UserModel; // For now, this is only rendered in contexts where the current user is logged in
  }

  @action
  handleCollapseButtonClick() {
    this.args.onCollapseButtonClick?.(this.containerElement!);
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.containerElement = element;

    if (this.args.isExpanded) {
      this.loadAsyncResources.perform();
    }

    // We still haven't migrated all solutions to have highlighted files, some only have changed files
    if (this.args.solution.highlightedFiles && this.args.solution.highlightedFiles.length > 0) {
      this.diffSource = 'highlighted-files';
    }
  }

  @action
  handleDidUpdateIsExpanded(_div: HTMLDivElement, [isExpanded]: [boolean]) {
    if (isExpanded) {
      this.loadAsyncResources.perform();
    }
  }

  @action
  handleDiffSourceChange(diffSource: 'changed-files' | 'highlighted-files') {
    this.diffSource = diffSource;
  }

  @action
  handleExpandButtonClick() {
    if (this.args.onExpandButtonClick) {
      this.args.onExpandButtonClick(this.containerElement!);
    }

    this.loadAsyncResources.perform();
  }

  loadFileComparisons = task(async () => {
    // Already loaded
    if (this.fileComparisons.length > 0) {
      return;
    }

    this.fileComparisons = await this.args.solution.fetchFileComparisons({});
  });

  loadAsyncResources = task({ keepLatest: true }, async () => {
    await Promise.all([this.loadFileComparisons.perform()]);
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard': typeof CommunitySolutionCard;
  }
}
