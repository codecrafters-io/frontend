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

interface stageWithBorderInfo {
  stage: StageModel;
  addBorder: boolean;
}

export default class CourseStageDropdownComponent extends Component<Signature> {
  get sortedStagesByExtensionForDropdown() {
    const stageAndBorders: stageWithBorderInfo[] = [];

    let previousStageExtensionOffset = 0;
    let currentStageExtensionOffset = 0;

    this.args.stages.forEach((stage) => {
      if (stage.positionWithinExtension == null) {
        currentStageExtensionOffset = 0;
      } else {
        currentStageExtensionOffset = stage.positionWithinCourse - stage.positionWithinExtension;
      }

      // The idea is that within all stages of a single extension the offset between
      // positionWithinCourse and positionWithinExtension stays constant. It
      // only changes when a new extension is started.
      if (previousStageExtensionOffset == currentStageExtensionOffset) {
        stageAndBorders.push({ stage: stage, addBorder: false });
      } else {
        stageAndBorders.push({ stage: stage, addBorder: true });
      }

      previousStageExtensionOffset = currentStageExtensionOffset;
    });

    return stageAndBorders;
  }

  @action
  handleStageDropdownLinkClick(stage: StageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedStageChange(stage);
  }
}
