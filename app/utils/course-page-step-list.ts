import BaseStagesCompletedStep from './course-page-step-list/base-stages-completed-step';
import BaseStagesStepGroup from './course-page-step-list/base-stages-step-group';
import CourseCompletedStep from 'codecrafters-frontend/utils/course-page-step-list/course-completed-step';
import CourseCompletedStepGroup from './course-page-step-list/course-completed-step-group';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import ExtensionCompletedStep from './course-page-step-list/extension-completed-step';
import ExtensionStepGroup from './course-page-step-list/extension-step-group';
import IntroductionStep from 'codecrafters-frontend/utils/course-page-step-list/introduction-step';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import StepGroup from 'codecrafters-frontend/utils/course-page-step-list/step-group';
import { cached, tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/owner';

export { StepDefinition };

export class StepListDefinition {
  @tracked declare repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    this.repository = repository;
  }

  get activeStep() {
    return this.visibleSteps.find((step) => step.status !== 'complete');
  }

  get baseStagesStepGroup(): StepGroup {
    const steps: StepDefinition[] = [];

    steps.push(new IntroductionStep(this.repository));
    steps.push(new SetupStep(this.repository));

    if (!this.repository.stageList) {
      this.repository.course.sortedBaseStages.forEach((stage) => {
        // TODO: Find better way around this?
        const fakeStageListItem = { stage: stage } as RepositoryStageListItemModel;
        steps.push(new CourseStageStep(this.repository, fakeStageListItem));
      });
    } else {
      this.repository.stageList.items
        .filter((item) => item.isBaseStage)
        .forEach((item) => {
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
        const steps: StepDefinition[] = [];

        extension.sortedStages.forEach((stage) => {
          const fakeStageListItem = { stage } as RepositoryStageListItemModel;
          steps.push(new CourseStageStep(this.repository, fakeStageListItem));
        });

        steps.push(new ExtensionCompletedStep(this.repository, extension));
        stepGroups.push(new ExtensionStepGroup(extension, steps));
      });
    } else {
      let stepsInNextGroup: StepDefinition[] = [];

      this.repository.stageList.items
        .filter((item) => !item.isBaseStage)
        .forEach((item) => {
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

        // TODO: Remove once we don't need feature flags inside step progress text
        setOwner(step, getOwner(this.repository)!);
      });
    });

    return stepGroups;
  }

  get steps(): StepDefinition[] {
    return this.stepGroups.reduce((steps, stepGroup) => steps.concat(stepGroup.steps), [] as StepDefinition[]);
  }

  get visibleSteps() {
    return this.steps.filter((step) => !step.isHidden);
  }

  nextVisibleStepFor(step: StepDefinition): StepDefinition | null {
    const stepIndex = this.visibleSteps.indexOf(step);

    if (stepIndex === -1) {
      throw new Error(`Step ${step.type} not found in step list`);
    }

    return this.visibleSteps[stepIndex + 1] || null;
  }

  previousVisibleStepFor(step: StepDefinition): StepDefinition | null {
    const stepIndex = this.visibleSteps.indexOf(step);

    if (stepIndex === -1) {
      throw new Error(`Step ${step.type} not found in step list`);
    }

    return this.visibleSteps[stepIndex - 1] || null;
  }

  visibleStepByType(type: StepDefinition['type']): StepDefinition | null {
    return this.visibleSteps.find((step) => step.type === type) || null;
  }

  visibleStepsAfter(step: StepDefinition): StepDefinition[] {
    const stepIndex = this.visibleSteps.indexOf(step);

    if (stepIndex === -1) {
      throw new Error(`Step ${step.type} not found in step list`);
    }

    return this.visibleSteps.slice(stepIndex + 1);
  }

  visibleStepsByType(type: StepDefinition['type']): StepDefinition[] {
    return this.visibleSteps.filter((step) => step.type === type);
  }
}
