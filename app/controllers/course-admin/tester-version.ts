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

  @tracked isApplyingUpdate = false;
  @tracked isSyncingWithGitHub = false;

  @action
  async handleApplyUpdateButtonClick() {
    if (!this.isApplyingUpdate) {
      this.isApplyingUpdate = true;

      // @ts-ignore
      await this.model.update.apply();

      this.isApplyingUpdate = false;
    }
  }

  @action
  async handleSyncWithGitHubButtonClick() {
    this.isSyncingWithGitHub = true;

    await this.model.course.syncCourseDefinitionUpdates();

    await this.store.query('course-definition-update', {
      course_id: this.model.course.id,
      include: ['course', 'applier'].join(','),
    });

    this.isSyncingWithGitHub = false;
  }
}
