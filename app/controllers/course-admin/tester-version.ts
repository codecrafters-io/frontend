import Controller from '@ember/controller';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminTesterVersionController extends Controller {
  declare model: {
    course: {
      id: string;
      definitionRepositoryFullName: string;
      syncCourseDefinitionUpdates: () => Promise<void>;
    };

    testerVersion: CourseTesterVersionModel;
  };

  @service declare store: Store;

  @tracked isActivating = false;
  @tracked isDeprovisioningTestRunners = false;
  @tracked shouldShowDeprovisioningNotice = false;

  get activationConfirmationMessage() {
    // @ts-ignore
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

      // @ts-ignore
      await this.model.testerVersion.activate();

      await this.store.query('course-tester-version', {
        // @ts-ignore
        course_id: this.model.testerVersion.course.id,
        include: ['course', 'activator'].join(','),
      });

      this.isActivating = false;
    }
  }

  @action
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
  async handleDeprovisionTestRunnersButtonClick() {
    this.isDeprovisioningTestRunners = true;
    this.shouldShowDeprovisioningNotice = true;

    // @ts-ignore
    await this.model.testerVersion.deprovision();

    this.isDeprovisioningTestRunners = false;
  }

  @action
  async handleDismissButtonClick() {
    this.shouldShowDeprovisioningNotice = false;
  }
}
