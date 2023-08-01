import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdatesController extends Controller {
  @tracked isSyncingWithGithub = false;

  @action
  async handleSyncWithGithubButtonClick() {
    this.isSyncingWithGithub = true;

    await this.model.course.syncCourseDefinitionUpdates({ course_id: this.model.course.id });

    this.isSyncingWithGithub = false;
  }
}
