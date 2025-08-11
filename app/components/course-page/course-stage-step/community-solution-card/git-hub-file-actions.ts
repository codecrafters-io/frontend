import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
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

export default class GitHubFileActionsComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isCreatingExport = false;

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }

  private createExport() {
    if (this.isCreatingExport) {
      return;
    }

    this.isCreatingExport = true;

    this.args.solution
      .createGithubExport()
      .then((exportRecord) => {
        this.isCreatingExport = false;
        const githubUrl = exportRecord.githubUrlForFile(this.args.filename);

        if (githubUrl) {
          window.open(githubUrl, '_blank');
        }
      })
      .catch((error) => {
        console.error('Error creating export:', error);
        this.isCreatingExport = false;
      });
  }

  private getLatestUnexpiredExport(): CommunitySolutionExportModel | null {
    const exports = this.args.solution.exports;

    if (!exports?.length) {
      return null;
    }

    const unexpiredExports = exports.filter((exportRecord) => new Date() < exportRecord.expiresAt);

    if (!unexpiredExports.length) {
      return null;
    }

    return unexpiredExports.sortBy('expiresAt').get('lastObject') || null;
  }

  @action
  handleViewOnGithub() {
    const latestExport = this.getLatestUnexpiredExport();

    if (latestExport?.status === 'provisioned') {
      const githubUrl = latestExport.githubUrlForFile(this.args.filename);

      if (githubUrl) {
        latestExport.markAsAccessed({});
        window.open(githubUrl, '_blank');
      }
    } else {
      this.createExport();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::GitHubFileActions': typeof GitHubFileActionsComponent;
  }
}
