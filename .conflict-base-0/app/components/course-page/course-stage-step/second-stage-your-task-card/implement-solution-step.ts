import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
  };
}

export default class ImplementSolutionStep extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  transition = fade;

  @tracked expandedHintIndex: number | null = null;
  @tracked solutionIsBlurred = true;

  get solution() {
    return this.args.repository.secondStageSolution;
  }

  @action
  handleHideSolutionButtonClick(): void {
    this.solutionIsBlurred = true;
  }

  @action
  handleHintCardHeaderClick(hintIndex: number): void {
    const hint = this.solution!.hintsJson![hintIndex]!;
    const analyticsEventContext = {
      solution_id: this.solution!.id,
      hint_number: hintIndex + 1,
      hint_title: hint.title_markdown,
    };

    if (this.expandedHintIndex === hintIndex) {
      this.expandedHintIndex = null;
      this.analyticsEventTracker.track('collapsed_stage_solution_hint', analyticsEventContext);
    } else {
      this.expandedHintIndex = hintIndex;
      this.solutionIsBlurred = true;

      this.analyticsEventTracker.track('expanded_stage_solution_hint', analyticsEventContext);
    }
  }

  @action
  handleRevealSolutionButtonClick(): void {
    this.solution?.createView();
    this.solutionIsBlurred = false;
    this.expandedHintIndex = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::ImplementSolutionStep': typeof ImplementSolutionStep;
  }
}
