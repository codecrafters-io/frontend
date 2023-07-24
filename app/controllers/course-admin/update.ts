import Controller from '@ember/controller';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminUpdateController extends Controller {
  declare model: { update: CourseDefinitionUpdateModel; course: unknown };
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
}
