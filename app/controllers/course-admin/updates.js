import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdatesController extends Controller {
  @service store;

  @tracked isSyncingWithGithub = false;

  @action
  async handleSyncWithGithubButtonClick() {
    this.isSyncingWithGithub = true;

    await this.model.course.syncCourseDefinitionUpdates();

    await this.store.query('course-definition-update', {
      course_id: this.model.course.id,
      include: ['course', 'applier'].join(','),
    });

    this.isSyncingWithGithub = false;
  }
}
