import { action } from '@ember/object';
import Component from '@glimmer/component';
import StageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stages: stageWithBorderInfo[];
    onRequestedStageChange: (stage: StageModel) => void;
  };
}

interface stageWithBorderInfo {
  stage: StageModel;
  addBorder: boolean;
}

export default class CourseStageDropdownComponent extends Component<Signature> {
  @action
  handleStageDropdownLinkClick(stage: StageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedStageChange(stage);
  }
}
