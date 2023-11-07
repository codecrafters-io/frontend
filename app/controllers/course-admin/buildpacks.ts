import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TemporaryCourseModel } from 'codecrafters-frontend/models/temporary-types';

export default class BuildpacksController extends Controller {
  declare model: {
    course: TemporaryCourseModel;
  };

  @service declare store: Store;

  @tracked isSyncingWithGitHub = false;
  @tracked errorMessage: string | null = null;

  get sortedBuildpacks() {
    return this.model.course.buildpacks.sortBy('language.name');
  }

  @action
  async handleSyncWithGitHubButtonClick() {
    this.isSyncingWithGitHub = true;

    this.errorMessage = null;
    const syncResult = await this.model.course.syncBuildpacks();

    if (syncResult['error']) {
      this.errorMessage = syncResult['error'];
    }

    await this.store.query('buildpack', {
      course_id: this.model.course.id,
      include: ['course', 'language'].join(','),
    });

    this.isSyncingWithGitHub = false;
  }
}
