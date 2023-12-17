import StepGroup from './step-group';

export default class CourseCompletedStepGroup extends StepGroup {
  get title() {
    return null;
  }

  get type(): 'BaseStagesStepGroup' | 'ExtensionStepGroup' | 'CourseCompletedStepGroup' {
    return 'CourseCompletedStepGroup';
  }
}
