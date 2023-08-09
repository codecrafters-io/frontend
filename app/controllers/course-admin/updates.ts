import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdatesController extends Controller {
  declare model: {
    course: {
      id: string;
      definitionRepositoryLink: string,
      definitionRepositoryFullName: string,
      syncCourseDefinitionUpdates: () => Promise<void>
    }
  };

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare store: Store;

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
    this.analyticsEventTracker.track('synced_course_definition_updates', {
      course_id: this.model.course.id,
    });
  }

  get sortedDefinitionUpdates() {
    // @ts-ignore
    return this.model.course.definitionUpdates.sortBy('lastSyncedAt').reverse();
  }
}
