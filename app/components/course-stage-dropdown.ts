import { action } from '@ember/object';
import Component from '@glimmer/component';
import StageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stages: StageModel[];
    onRequestedStageChange: (stage: StageModel) => void;
  };
}

export default class CourseStageDropdownComponent extends Component<Signature> {
  @action
  handleStageDropdownLinkClick(stage: StageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedStageChange(stage);
  }
}
