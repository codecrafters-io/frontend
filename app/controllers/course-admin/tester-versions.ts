import Controller from '@ember/controller';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseTesterVersionsController extends Controller {
  declare model: {
    course: {
      id: string;
      syncCourseTesterVersions: () => Promise<void>;
      testerRepositoryLink: string;
      testerRepositoryFullName: string;
      testerVersions: CourseTesterVersionModel[];
    };
  };

  @service declare store: Store;

  @tracked isSyncingWithGitHub = false;

  get sortedTesterVersions() {
    return this.model.course.testerVersions.toSorted(fieldComparator('createdAt')).reverse();
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
  async handleSyncWithGitHubButtonClick() {
    this.isSyncingWithGitHub = true;

    await this.model.course.syncCourseTesterVersions();
    await this.reloadCourseTesterVersionsTask.perform();

    this.isSyncingWithGitHub = false;
  }
}
