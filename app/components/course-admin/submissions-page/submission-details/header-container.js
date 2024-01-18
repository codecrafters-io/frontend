import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AdminCourseSubmissionsPageSubmissionDetailsHeaderContainerComponent extends Component {
  @tracked isUpdatingTesterVersion = false;
  @tracked isForking = false;
  @service router;

  get durationInMilliseconds() {
    return this.args.submission.evaluations[0].createdAt.getTime() - this.args.submission.createdAt.getTime();
  }

  get formattedDuration() {
    if (this.args.submission.evaluations[0]) {
      return `${this.durationInMilliseconds / 1000} seconds`;
    } else {
      return '-';
    }
  }

  @action
  async handleCopyRepositoryURLButtonClick() {
    await navigator.clipboard.writeText(this.args.submission.repository.cloneUrl);
  }

  @action
  async handleForkButtonClick() {
    if (this.isForking) {
      return;
    }

    this.isForking = true;
    const forkResponse = await this.args.submission.repository.fork();
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
    await this.args.submission.repository.updateTesterVersion();
    this.isUpdatingTesterVersion = false;
  }

  @action
  async handleViewCodeButtonClick() {
    window.open(this.args.submission.githubStorageHtmlUrl, '_blank').focus();
  }
}
