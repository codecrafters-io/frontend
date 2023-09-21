import { tracked } from '@glimmer/tracking';
import CourseCompletedStep from 'codecrafters-frontend/lib/course-page-step-list/course-completed-step';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import IntroductionStep from 'codecrafters-frontend/lib/course-page-step-list/introduction-step';
import SetupStep from 'codecrafters-frontend/lib/course-page-step-list/setup-step';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import StepGroup from 'codecrafters-frontend/lib/course-page-step-list/step-group';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

// @ts-ignore: No types?
import { cached } from '@glimmer/tracking';
import BaseStagesStepGroup from './course-page-step-list/base-stages-step-group';
import ExtensionStepGroup from './course-page-step-list/extension-step-group';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';

export { Step };

export class StepList {
  @tracked declare repository: TemporaryRepositoryModel;

  constructor(repository: TemporaryRepositoryModel) {
    this.repository = repository;
  }

  get visibleSteps() {
    return this.steps.filter((step) => !step.isHidden);
  }

  get activeStep() {
    return this.visibleSteps.find((step) => step.status !== 'complete');
  }

  nextVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) + 1] || null;
  }

  previousVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) - 1] || null;
  }

  @cached
  get stepGroups(): StepGroup[] {
    return [this.baseStagesStepGroup, ...this.extensionStepGroups];
  }

  get baseStagesStepGroup(): StepGroup {
    let steps: Step[] = [];

    steps.push(new IntroductionStep(this.repository, 1, 1));
    steps.push(new SetupStep(this.repository, 2, 2));

    let currentStepPosition = 3;

    if (!this.repository.stageList) {
      this.repository.course.sortedBaseStages.forEach((stage) => {
        // TODO: Find better way around this?
        const fakeStageListItem = { stage: stage, isDisabled: false } as RepositoryStageListItemModel;
        steps.push(new CourseStageStep(this.repository, fakeStageListItem, currentStepPosition, currentStepPosition));
        currentStepPosition++;
      });
    } else {
      this.repository.stageList.items.filterBy('isBaseStage').forEach((item) => {
        steps.push(new CourseStageStep(this.repository, item, currentStepPosition, currentStepPosition));
        currentStepPosition++;
      });
    }

    steps.push(new CourseCompletedStep(this.repository, currentStepPosition, currentStepPosition));

    return new BaseStagesStepGroup(steps);
  }

  get extensionStepGroups(): StepGroup[] {
    if (!this.repository.stageList) {
      return [];
    }

    const stepGroups: ExtensionStepGroup[] = [];

    let stepsInNextGroup: Step[] = [];
    let currentPositionInGroup = 1;
    let currentGlobalPosition = (this.baseStagesStepGroup.steps[this.baseStagesStepGroup.steps.length - 1] as Step).globalPosition + 1;

    this.repository.stageList.items.rejectBy('isBaseStage').forEach((item) => {
      const extensionInNextGroup = stepsInNextGroup[0] && (stepsInNextGroup[0] as CourseStageStep).courseStage.primaryExtension;
      if (extensionInNextGroup && item.stage.primaryExtension != extensionInNextGroup) {
        stepGroups.push(new ExtensionStepGroup(extensionInNextGroup, stepsInNextGroup));
        stepsInNextGroup = [];
        currentPositionInGroup = 1;
      }

      stepsInNextGroup.push(new CourseStageStep(this.repository, item, currentPositionInGroup, currentGlobalPosition));

      currentPositionInGroup++;
      currentGlobalPosition++;
    });

    if (stepsInNextGroup.length > 0) {
      stepGroups.push(
        new ExtensionStepGroup((stepsInNextGroup[0] as CourseStageStep).courseStage.primaryExtension as CourseExtensionModel, stepsInNextGroup),
      );
    }

    return stepGroups;
  }

  get steps(): Step[] {
    return this.stepGroups.reduce((steps, stepGroup) => steps.concat(stepGroup.steps), [] as Step[]);
  }
}
