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
import CourseCompletedStepGroup from './course-page-step-list/course-completed-step-group';

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

  get courseCompletedStepGroup(): StepGroup {
    return new CourseCompletedStepGroup([new CourseCompletedStep(this.repository)]);
  }

  @cached
  get stepGroups(): StepGroup[] {
    const stepGroups = [this.baseStagesStepGroup, ...this.extensionStepGroups, this.courseCompletedStepGroup];

    let globalPosition = 1;

    stepGroups.forEach((stepGroup) => {
      let positionInGroup = 1;

      stepGroup.steps.forEach((step) => {
        step.positionInGroup = positionInGroup;
        step.globalPosition = globalPosition;

        positionInGroup += 1;
        globalPosition += 1;
      });
    });

    return stepGroups;
  }

  get baseStagesStepGroup(): StepGroup {
    const steps: Step[] = [];

    steps.push(new IntroductionStep(this.repository));
    steps.push(new SetupStep(this.repository));

    if (!this.repository.stageList) {
      this.repository.course.sortedBaseStages.forEach((stage) => {
        // TODO: Find better way around this?
        const fakeStageListItem = { stage: stage, isDisabled: false } as RepositoryStageListItemModel;
        steps.push(new CourseStageStep(this.repository, fakeStageListItem));
      });
    } else {
      this.repository.stageList.items.filterBy('isBaseStage').forEach((item) => {
        steps.push(new CourseStageStep(this.repository, item));
      });
    }

    return new BaseStagesStepGroup(steps);
  }

  get extensionStepGroups(): StepGroup[] {
    if (!this.repository.stageList) {
      return [];
    }

    const stepGroups: ExtensionStepGroup[] = [];

    let stepsInNextGroup: Step[] = [];

    this.repository.stageList.items.rejectBy('isBaseStage').forEach((item) => {
      const extensionInNextGroup = stepsInNextGroup[0] && (stepsInNextGroup[0] as CourseStageStep).courseStage.primaryExtension;

      if (extensionInNextGroup && item.stage.primaryExtension != extensionInNextGroup) {
        stepGroups.push(new ExtensionStepGroup(extensionInNextGroup, stepsInNextGroup));
        stepsInNextGroup = [];
      }

      stepsInNextGroup.push(new CourseStageStep(this.repository, item));
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
