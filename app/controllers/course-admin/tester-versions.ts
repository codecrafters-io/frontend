import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';

export default class CourseTesterVersionsController extends Controller {
  declare model: {
    course: {
      id: string;
      testerRepositoryLink: string;
      testerRepositoryFullName: string;
      testerVersions: CourseTesterVersionModel[];
    };
  };

  @service declare store: Store;

  get sortedTesterVersions() {
    return this.model.course.testerVersions.sortBy('lastSyncedAt').reverse();
  }
}
