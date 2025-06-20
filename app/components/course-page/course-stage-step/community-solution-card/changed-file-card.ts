import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';
import type CommunitySolutionExportModel from 'codecrafters-frontend/models/community-solution-export';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    changedFile: CommunityCourseStageSolution['changedFiles'][number];
    onPublishToGithubButtonClick: () => void;
    solution: CommunityCourseStageSolution;
  };
}

export default class ChangedFileCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked isCreatingExport = false;

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }

  @action
  async handleViewOnGithubClick(): Promise<void> {
    const solution = this.args.solution;

    // Check if we have a current valid export
    const currentExport = solution.currentExport;

    if (currentExport && currentExport.isProvisioned && currentExport.baseUrl) {
      // We have a provisioned export, mark as accessed and redirect
      await solution.markExportAsAccessed(currentExport);
      const url = `${currentExport.baseUrl}/${this.args.changedFile.filename}`;
      window.open(url, '_blank', 'noopener,noreferrer');

      return;
    }

    if (currentExport && currentExport.isProvisioning) {
      // Export is still being created, wait for it to complete
      this.isCreatingExport = true;

      try {
        await this.waitForExportCompletion(currentExport);

        if (currentExport.isProvisioned && currentExport.baseUrl) {
          await solution.markExportAsAccessed(currentExport);
          const url = `${currentExport.baseUrl}/${this.args.changedFile.filename}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          alert('Export is taking longer than expected. Please try again.');
        }
      } catch (error) {
        console.error('Error waiting for export:', error);
        alert('Export is taking longer than expected. Please try again.');
      } finally {
        this.isCreatingExport = false;
      }

      return;
    }

    // No valid export exists, create a new one
    this.isCreatingExport = true;

    try {
      const newExport = await solution.createOrGetExport();

      // Poll for completion if it's still provisioning
      if (newExport.isProvisioning) {
        await this.waitForExportCompletion(newExport);
      }

      if (newExport.isProvisioned && newExport.baseUrl) {
        await solution.markExportAsAccessed(newExport);
        const url = `${newExport.baseUrl}/${this.args.changedFile.filename}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Failed to create export. Please try again.');
      }
    } catch (error) {
      console.error('Error creating export:', error);
      alert('Failed to create export. Please try again.');
    } finally {
      this.isCreatingExport = false;
    }
  }

  private async waitForExportCompletion(exportModel: CommunitySolutionExportModel): Promise<void> {
    const maxAttempts = 30; // 30 seconds timeout
    let attempts = 0;

    while (attempts < maxAttempts && exportModel.isProvisioning) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      try {
        await exportModel.reload();
        attempts++;
      } catch (error) {
        console.error('Error reloading export:', error);
        break;
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::ChangedFileCard': typeof ChangedFileCardComponent;
  }
}
