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
      .createGithubExport({})
      .then((exportRecord) => {
        this.pollExportStatus(exportRecord.id);
      })
      .catch((error) => {
        console.error('Error creating export:', error);
        this.isCreatingExport = false;
      });
  }

  private getLatestUnexpiredExport(): CommunitySolutionExportModel | null {
    const unexpiredExports = this.args.solution.exports.filterBy('isExpired', false);

    if (unexpiredExports.length === 0) {
      return null;
    }

    return unexpiredExports.sortBy('lastAccessedAt').get('lastObject') || null;
  }

  @action
  onViewOnGithubButtonClickWhenNotPublished() {
    const latestExport = this.getLatestUnexpiredExport();

    if (latestExport) {
      if (latestExport.status === 'provisioned') {
        const githubUrl = latestExport.githubUrlForFile(this.args.filename);

        if (githubUrl) {
          window.open(githubUrl, '_blank');
        }
      } else if (latestExport.status === 'provisioning') {
        this.isCreatingExport = true;
        this.pollExportStatus(latestExport.id);
      }
    } else {
      this.createExport();
    }
  }

  private async pollExportStatus(exportId: string) {
    const maxAttempts = 20;
    const pollInterval = 10000;
    let attempts = 0;

    const poll = async (): Promise<void> => {
      attempts++;

      try {
        const exportRecord = await this.store.findRecord('community-solution-export', exportId, {
          adapterOptions: {
            solutionId: this.args.solution.id,
          },
        });

        if (exportRecord.status === 'provisioned') {
          this.isCreatingExport = false;

          const latestExport = this.getLatestUnexpiredExport();

          if (latestExport) {
            const githubUrl = latestExport.githubUrlForFile(this.args.filename);

            if (githubUrl) {
              window.open(githubUrl, '_blank');
            }
          }

          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          console.error('Export polling timed out');
          this.isCreatingExport = false;
        }
      } catch (error) {
        console.error('Error polling export status:', error);
        this.isCreatingExport = false;
      }
    };

    await poll();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::GitHubFileActions': typeof GitHubFileActionsComponent;
  }
}
