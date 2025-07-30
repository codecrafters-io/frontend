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

  @action
  onViewOnGithubButtonClickWhenNotPublished() {
    console.log('onViewOnGithubButtonClickWhenNotPublished');
    console.log('All solution exports:', this.args.solution.exports);
    const latestExport = this.getLatestUnexpiredExport();
    if (latestExport) {
      if (latestExport.status === 'provisioned') {
        const githubUrl = latestExport.githubUrlForFile(this.args.filename);
        if (githubUrl) {
          window.open(githubUrl, '_blank');
        }
      } else if (latestExport.status === 'provisioning') {
        // Start polling the existing provisioning export
        this.isCreatingExport = true;
        this.pollExportStatus(latestExport.id);
      }
    } else {
      console.log('No unexpired exports found');
      this.createExport();
    }
  }

  private getLatestUnexpiredExport(): CommunitySolutionExportModel | null {
    const unexpiredExports = this.args.solution.exports.filterBy('isExpired', false);
    
    if (unexpiredExports.length === 0) {
      return null;
    }
    
    return unexpiredExports.sortBy('lastAccessedAt').get('lastObject') || null;
  }

  private async createExport() {
    if (this.isCreatingExport) {
      return;
    }

    this.isCreatingExport = true;

    try {
      const exportRecord = await this.args.solution.createGithubExport({});
      await this.pollExportStatus(exportRecord.id);
    } catch (error) {
      console.error('Error creating export:', error);
      this.isCreatingExport = false;
    }
  }

  private async pollExportStatus(exportId: string) {
    const maxAttempts = 20; // 20 attempts * 15 seconds = 5 minutes
    const pollInterval = 15000; // 15 seconds
    let attempts = 0;

    const poll = async (): Promise<void> => {
      attempts++;

      try {
        const exportRecord = await this.store.findRecord('community-solution-export', exportId, {
          adapterOptions: {
            solutionId: this.args.solution.id
          }
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