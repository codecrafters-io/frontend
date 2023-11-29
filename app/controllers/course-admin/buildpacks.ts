import Controller from '@ember/controller';
import CourseModel from 'codecrafters-frontend/models/course';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BuildpacksController extends Controller {
  declare model: {
    course: CourseModel;
  };

  @service declare store: Store;

  @tracked isSyncingWithGitHub = false;
  @tracked errorMessage: string | null = null;

  get sortedLatestBuildpacks() {
    return this.model.course.buildpacks.filterBy('isLatest').sortBy('language.name');
  }

  get sortedOutdatedBuildpacks() {
    return this.model.course.buildpacks
      .filterBy('isOutdated')
      .toArray()
      .sort((a, b) => {
        if (a.language.name === b.language.name) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        } else {
          return a.language.name.localeCompare(b.language.name);
        }
      });
  }

  @action
  async handleSyncWithGitHubButtonClick() {
    this.isSyncingWithGitHub = true;

    this.errorMessage = null;
    const syncResult = await this.model.course.syncBuildpacks(null);

    if ('error' in syncResult) {
      this.errorMessage = syncResult['error'];
    }

    await this.store.query('buildpack', {
      course_id: this.model.course.id,
      include: ['course', 'language'].join(','),
    });

    this.isSyncingWithGitHub = false;
  }
}
