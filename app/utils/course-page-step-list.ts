import { tracked } from '@glimmer/tracking';
import CourseCompletedStep from 'codecrafters-frontend/utils/course-page-step-list/course-completed-step';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import IntroductionStep from 'codecrafters-frontend/utils/course-page-step-list/introduction-step';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import StepGroup from 'codecrafters-frontend/utils/course-page-step-list/step-group';

// @ts-ignore: No types?
import { cached } from '@glimmer/tracking';
import BaseStagesStepGroup from './course-page-step-list/base-stages-step-group';
import ExtensionStepGroup from './course-page-step-list/extension-step-group';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseCompletedStepGroup from './course-page-step-list/course-completed-step-group';
import BaseStagesCompletedStep from './course-page-step-list/base-stages-completed-step';
import ExtensionCompletedStep from './course-page-step-list/extension-completed-step';

export { Step };

export class StepList {
  @tracked declare repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    this.repository = repository;
  }

  get activeStep() {
    return this.visibleSteps.find((step) => step.status !== 'complete');
  }

  get baseStagesStepGroup(): StepGroup {
    const steps: Step[] = [];

    steps.push(new IntroductionStep(this.repository));
    steps.push(new SetupStep(this.repository));

    if (!this.repository.stageList) {
      this.repository.course.sortedBaseStages.forEach((stage) => {
        // TODO: Find better way around this?
        const fakeStageListItem = { stage: stage } as RepositoryStageListItemModel;
        steps.push(new CourseStageStep(this.repository, fakeStageListItem));
      });
    } else {
      this.repository.stageList.items.filterBy('isBaseStage').forEach((item) => {
        steps.push(new CourseStageStep(this.repository, item));
      });
    }

    steps.push(new BaseStagesCompletedStep(this.repository));

    return new BaseStagesStepGroup(steps);
  }

  get courseCompletedStepGroup(): StepGroup {
    return new CourseCompletedStepGroup([new CourseCompletedStep(this.repository)]);
  }

  get extensionStepGroups(): StepGroup[] {
    const stepGroups: ExtensionStepGroup[] = [];

    if (!this.repository.stageList) {
      this.repository.course.sortedExtensions.forEach((extension) => {
        const steps: Step[] = [];

        extension.sortedStages.forEach((stage) => {
          const fakeStageListItem = { stage } as RepositoryStageListItemModel;
          steps.push(new CourseStageStep(this.repository, fakeStageListItem));
        });

        steps.push(new ExtensionCompletedStep(this.repository, extension));
        stepGroups.push(new ExtensionStepGroup(extension, steps));
      });
    } else {
      let stepsInNextGroup: Step[] = [];

      this.repository.stageList.items.rejectBy('isBaseStage').forEach((item) => {
        const extensionInNextGroup = stepsInNextGroup[0] && (stepsInNextGroup[0] as CourseStageStep).courseStage.primaryExtension;

        if (extensionInNextGroup && item.stage.primaryExtension != extensionInNextGroup) {
          stepsInNextGroup.push(new ExtensionCompletedStep(this.repository, extensionInNextGroup));
          stepGroups.push(new ExtensionStepGroup(extensionInNextGroup, stepsInNextGroup));
          stepsInNextGroup = [];
        }

        stepsInNextGroup.push(new CourseStageStep(this.repository, item));
      });

      if (stepsInNextGroup.length > 0) {
        const extensionInLastGroup = (stepsInNextGroup[0] as CourseStageStep).courseStage.primaryExtension as CourseExtensionModel;
        stepsInNextGroup.push(new ExtensionCompletedStep(this.repository, extensionInLastGroup));
        stepGroups.push(new ExtensionStepGroup(extensionInLastGroup, stepsInNextGroup));
      }
    }

    return stepGroups;
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

  get steps(): Step[] {
    return this.stepGroups.reduce((steps, stepGroup) => steps.concat(stepGroup.steps), [] as Step[]);
  }

  get visibleSteps() {
    return this.steps.filter((step) => !step.isHidden);
  }

  nextVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) + 1] || null;
  }

  previousVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) - 1] || null;
  }

  visibleStepByType(type: Step['type']): Step | null {
    return this.visibleSteps.find((step) => step.type === type) || null;
  }
}
