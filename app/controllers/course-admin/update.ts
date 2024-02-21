import Controller from '@ember/controller';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdateController extends Controller {
  declare model: {
    update: CourseDefinitionUpdateModel;
    course: {
      id: string;
      definitionRepositoryFullName: string;
      syncCourseDefinitionUpdates: () => Promise<void>;
    };
  };

  @service declare store: Store;

  @tracked isApplyingUpdate = false;
  @tracked isSyncingWithGitHub = false;

  get viewDiffLink() {
    if (!this.model.update.oldCommitSha) {
      return `https://github.com/${this.model.course.definitionRepositoryFullName}/commit/${this.model.update.newCommitSha}`;
    }

    return `https://github.com/${this.model.course.definitionRepositoryFullName}/compare/${this.model.update.oldCommitSha}..${this.model.update.newCommitSha}`;
  }

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
