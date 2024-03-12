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

  @action
  async handleActivateButtonClick() {
    if (!this.isActivating) {
      this.isActivating = true;

      // @ts-ignore
      await this.model.testerVersion.activate();

      this.isActivating = false;
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
