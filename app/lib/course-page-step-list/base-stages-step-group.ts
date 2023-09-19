import StepGroup from "./step-group";

export default class BaseStagesStepGroup extends StepGroup {
  get title() {
    return null;
  }

  get type(): 'BaseStagesStepGroup' | 'ExtensionStepGroup' {
    return 'BaseStagesStepGroup';
  }
}
