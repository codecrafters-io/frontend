import Component from '@glimmer/component';
import { action } from '@ember/object';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

export interface Signature {
  Args: {
    submission: SubmissionModel;
  };
}

export default class HeaderContainer extends Component<Signature> {
  @tracked isUpdatingBuildpack = false;
  @tracked isUpdatingTesterVersion = false;
  @tracked isForking = false;
  @service declare router: RouterService;

  get buildpackSlug() {
    if (this.args.submission.repository.buildpack) {
      return this.args.submission.repository.buildpack.slug;
    } else {
      return 'Unknown';
    }
  }

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
  async handleBuildpackUpdateButtonClick() {
    this.isUpdatingBuildpack = true;
    await this.args.submission.repository.updateBuildpack({});
    this.isUpdatingBuildpack = false;
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

    const forkResponse = await this.args.submission.repository.fork({
      commit_sha: this.args.submission.commitSha,
    });

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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::HeaderContainer': typeof HeaderContainer;
  }
}
