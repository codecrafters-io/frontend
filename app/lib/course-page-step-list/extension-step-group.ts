import StepGroup from 'codecrafters-frontend/lib/course-page-step-list/step-group';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import { Step } from '../course-page-step-list';

export default class ExtensionStepGroup extends StepGroup {
  extension: CourseExtensionModel;

  constructor(extension: CourseExtensionModel, steps: Step[]) {
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
