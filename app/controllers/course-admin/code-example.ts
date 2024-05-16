import Controller from '@ember/controller';
import { action } from '@ember/object';
import type { CodeExampleRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example';

export default class CodeExampleController extends Controller {
  declare model: CodeExampleRouteModel;

  @action
  handlePinCodeExampleToggled() {
    this.model.solution.isPinned = !this.model.solution.isPinned;
    this.model.solution.save();
  }
}
