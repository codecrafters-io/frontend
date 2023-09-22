import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdatesController extends Controller {
  declare model: {
    course: {
      id: string;
      definitionRepositoryLink: string;
      definitionRepositoryFullName: string;
      syncCourseDefinitionUpdates: () => Promise<void>;
    };
  };

  @service declare store: Store;

  @tracked isSyncingWithGitHub = false;

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

  get sortedDefinitionUpdates() {
    // @ts-ignore
    return this.model.course.definitionUpdates.sortBy('lastSyncedAt').reverse();
  }
}
