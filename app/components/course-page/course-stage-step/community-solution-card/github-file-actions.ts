import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import * as Sentry from '@sentry/ember';
import window from 'ember-window-mock';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';
import type CommunitySolutionExportModel from 'codecrafters-frontend/models/community-solution-export';
import type Store from '@ember-data/store';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }

  private async createExport(): Promise<CommunitySolutionExportModel | null> {
    if (this.isCreatingExport) return null;

    this.isCreatingExport = true;

    try {
      const exportRecord = await this.args.solution.createExport();
      this.isCreatingExport = false;

      return exportRecord;
    } catch (error) {
      Sentry.captureException(error);
      this.isCreatingExport = false;

      return null;
    }
  }

  private getLatestProvisionedExport(): CommunitySolutionExportModel | null {
    return (
      this.args.solution.exports
        .filter((item) => !item.isExpired)
        .filter((item) => item.isProvisioned)
        .toSorted(fieldComparator('expiresAt'))
        .at(-1) || null
    );
  }

  @action
  async handleViewOnGithubButtonClick() {
    const latestExport = this.getLatestProvisionedExport();

    if (latestExport) {
      const githubUrl = latestExport.githubUrlForFile(this.args.filename);
      latestExport.markAsAccessed({});
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    } else {
      const exportRecord = await this.createExport();

      if (exportRecord) {
        const githubUrl = exportRecord.githubUrlForFile(this.args.filename);
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::GithubFileActions': typeof GithubFileActionsComponent;
  }
}
