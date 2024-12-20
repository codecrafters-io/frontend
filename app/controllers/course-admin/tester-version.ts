import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/tester-version';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

export default class CourseAdminTesterVersionController extends Controller {
  declare model: ModelType;

  @service declare store: Store;

  @tracked isActivating = false;
  @tracked isDeprovisioningTestRunners = false;
  @tracked shouldShowDeprovisioningNotice = false;

  get activationConfirmationMessage() {
    const latestTesterVersion = this.model.testerVersion.course.latestTesterVersion;

    if (latestTesterVersion) {
      return `${latestTesterVersion.tagName} is the latest version. Are you sure you want to activate ${this.model.testerVersion.tagName} instead?`;
    } else {
      return `${this.model.testerVersion.tagName} is not the latest version. Are you sure you want to activate it?`;
    }
  }

  @action
  async activate() {
    if (!this.isActivating) {
      this.isActivating = true;

      await this.model.testerVersion.activate(null);
      await this.reloadCourseTesterVersionsTask.perform();

      this.isActivating = false;
    }
  }

  @action
  @waitFor
  async handleActivateButtonClick() {
    if (this.model.testerVersion.isLatest) {
      await this.activate();

      return;
    }

    if (window.confirm(this.activationConfirmationMessage)) {
      await this.activate();
    }
  }

  @action
  async handleCourseTesterVersionDidUpdate() {
    this.reloadCourseTesterVersionsTask.perform();
  }

  reloadCourseTesterVersionsTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-tester-version', {
      course_id: this.model.course.id,
      include: ['course', 'activator'].join(','),
    });
  });

  @action
  async handleDeprovisionTestRunnersButtonClick() {
    this.isDeprovisioningTestRunners = true;
    this.shouldShowDeprovisioningNotice = true;

    await this.model.testerVersion.deprovision(null);

    this.isDeprovisioningTestRunners = false;
  }

  @action
  handleWillDestroyContainer() {
    this.isDeprovisioningTestRunners = false;
    this.shouldShowDeprovisioningNotice = false;
    this.isActivating = false;
  }
}
