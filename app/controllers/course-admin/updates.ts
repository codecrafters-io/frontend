import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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

  get sortedDefinitionUpdates() {
    // @ts-expect-error definitionUpdates not typed
    return this.model.course.definitionUpdates.toSorted(fieldComparator('lastSyncedAt')).reverse();
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
