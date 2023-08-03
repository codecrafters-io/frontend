import Controller from '@ember/controller';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdateController extends Controller {
  declare model: { update: CourseDefinitionUpdateModel; course: { definitionRepositoryFullName: string }};
  @tracked isApplyingUpdate = false;

  @action
  async handleApplyUpdateButtonClick() {
    if (!this.isApplyingUpdate) {
      this.isApplyingUpdate = true;

      // @ts-ignore
      await this.model.update.apply();

      this.isApplyingUpdate = false;
    }
  }

  get viewDiffLink() {
    if (!this.model.update.oldCommitSha) {
      return `http://github.com/${this.model.course.definitionRepositoryFullName}/commit/${this.model.update.newCommitSha}`
    }
    return `http://github.com/${this.model.course.definitionRepositoryFullName}/compare/${this.model.update.oldCommitSha}..${this.model.update.newCommitSha}`
  }
}
