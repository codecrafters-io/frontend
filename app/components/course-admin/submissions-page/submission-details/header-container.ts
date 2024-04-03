import Component from '@glimmer/component';
import { action } from '@ember/object';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

export type Signature = {
  Args: {
    submission: SubmissionModel;
  };
};

export default class HeaderContainerComponent extends Component<Signature> {
  @tracked isUpdatingTesterVersion = false;
  @tracked isForking = false;

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get durationInMilliseconds() {
    return this.args.submission.evaluations[0]!.createdAt.getTime() - this.args.submission.createdAt.getTime();
  }

  get formattedDuration() {
    if (this.args.submission.evaluations[0]) {
      return `${this.durationInMilliseconds / 1000} seconds`;
    } else {
      return '-';
    }
  }

  get formattedLanguageProficiencyLevel() {
    return capitalize(this.args.submission.repository.languageProficiencyLevel);
  }

  get shortSubmissionCommitSha() {
    return this.args.submission.commitSha.substring(0, 8);
  }

  get shortSubmissionTreeSha() {
    if (!this.args.submission.treeSha) {
      return 'Unknown';
    }

    return this.args.submission.treeSha.substring(0, 8);
  }

  get testerVersionTagName() {
    if (this.args.submission.testerVersion) {
      return this.args.submission.testerVersion.tagName;
    } else {
      return 'Unknown';
    }
  }

  @action
  async handleCopyCommitShaButtonClick() {
    await navigator.clipboard.writeText(this.args.submission.commitSha);
  }

  @action
  async handleCopyRepositoryURLButtonClick() {
    await navigator.clipboard.writeText(this.args.submission.repository.cloneUrl);
  }

  @action
  async handleCopyTreeShaButtonClick() {
    await navigator.clipboard.writeText(this.args.submission.treeSha!);
  }

  @action
  async handleForkButtonClick() {
    if (this.isForking) {
      return;
    }

    this.isForking = true;
    const forkResponse = await this.args.submission.repository.fork({});
    this.isForking = false;

    const forkedRepositoryId = forkResponse.data.id;

    // Force reload
    window.location.href = this.router.urlFor('course.setup', this.args.submission.repository.course.slug, {
      queryParams: { repo: forkedRepositoryId },
    });
  }

  @action
  async handleTesterVersionUpdateButtonClick() {
    this.isUpdatingTesterVersion = true;
    await this.args.submission.repository.updateTesterVersion({});
    this.isUpdatingTesterVersion = false;
  }

  @action
  async handleViewCodeButtonClick() {
    window.open(this.args.submission.githubStorageHtmlUrl, '_blank')!.focus();
  }
}
