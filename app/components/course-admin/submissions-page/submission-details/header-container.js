import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageSubmissionDetailsHeaderContainerComponent extends Component {
  @tracked isUpdatingTesterVersion = false;

  get durationInMilliseconds() {
    return this.args.submission.evaluations.firstObject.createdAt.getTime() - this.args.submission.createdAt.getTime();
  }

  get formattedDuration() {
    if (this.args.submission.evaluations.firstObject) {
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
  async handleViewCodeButtonClick() {
    window.open(this.args.submission.githubStorageHtmlUrl, '_blank').focus();
  }

  @action
  async handleTesterVersionUpdateButtonClick() {
    this.isUpdatingTesterVersion = true;
    await this.args.submission.repository.updateTesterVersion();
    this.isUpdatingTesterVersion = false;
  }
}
