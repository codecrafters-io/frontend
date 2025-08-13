import StepGroup from 'codecrafters-frontend/utils/course-page-step-list/step-group';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import { StepDefinition } from '../course-page-step-list';

export default class ExtensionStepGroup extends StepGroup {
  extension: CourseExtensionModel;

  constructor(extension: CourseExtensionModel, steps: StepDefinition[]) {
    super(steps);

    this.extension = extension;
  }

  get title() {
    return this.extension.name;
  }

  get type(): 'ExtensionStepGroup' {
    return 'ExtensionStepGroup';
  }
}
