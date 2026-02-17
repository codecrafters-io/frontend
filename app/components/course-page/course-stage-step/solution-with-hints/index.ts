import Component from '@glimmer/component';
import type CourseStageSolutionModel from 'codecrafters-frontend/models/course-stage-solution';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    solution: CourseStageSolutionModel;
  };
}

export default class SolutionWithHints extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  transition = fade;

  @tracked expandedHintIndex: number | null = null;
  @tracked solutionIsBlurred = true;

  @action
  handleHideSolutionButtonClick(): void {
    this.solutionIsBlurred = true;
  }

  @action
  handleHintCardHeaderClick(hintIndex: number): void {
    const hint = this.args.solution.hintsJson![hintIndex]!;
    const analyticsEventContext = {
      solution_id: this.args.solution.id,
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
    this.args.solution.createView();
    this.solutionIsBlurred = false;
    this.expandedHintIndex = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SolutionWithHints': typeof SolutionWithHints;
  }
}
