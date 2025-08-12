import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as Sentry from '@sentry/ember';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';
import type CommunitySolutionExportModel from 'codecrafters-frontend/models/community-solution-export';
import type Store from '@ember-data/store';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    filename: string;
    onPublishToGithubButtonClick: () => void;
    solution: CommunityCourseStageSolution;
  };
}

export default class GithubFileActionsComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isCreatingExport = false;

  get isExportInProgress(): boolean {
    const latestExport = this.getLatestUnexpiredExport();

    return this.isCreatingExport || latestExport?.status === 'provisioning';
  }

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }

  private async createExport() {
    if (this.isCreatingExport) {
      return;
    }

    this.isCreatingExport = true;

    try {
      const exportRecord = await this.args.solution.createExport();
      this.isCreatingExport = false;
      const githubUrl = exportRecord.githubUrlForFile(this.args.filename);

      if (exportRecord.status === 'provisioned') {
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      Sentry.captureException(error);
      this.isCreatingExport = false;
    }
  }

  private getLatestUnexpiredExport(): CommunitySolutionExportModel | null {
    return this.args.solution.exports?.reject((exportRecord) => new Date() >= exportRecord.expiresAt)?.sortBy('expiresAt')?.lastObject || null;
  }

  @action
  handleViewOnGithubButtonClick() {
    const latestExport = this.getLatestUnexpiredExport();

    if (latestExport?.status === 'provisioned') {
      const githubUrl = latestExport.githubUrlForFile(this.args.filename);
      latestExport.markAsAccessed({});
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    } else {
      this.createExport();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::GithubFileActions': typeof GithubFileActionsComponent;
  }
}
