import type ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';

export default class Step {
  get routeParams(): { route: string; models: string[] } {
    throw new Error('Subclasses of Step must implement a routeParams getter');
  }

  // Status definitions:
  //
  // - complete: the step has been completed
  // - not_started: the step hasn't been started yet
  // - in_progress: the step is in progress
  // - locked: the step isn't ready to be worked on (it might depend on other steps)
  get status(): 'complete' | 'not_started' | 'in_progress' | 'locked' {
    throw new Error('Subclasses of Step must implement a status getter');
  }

  // Can be overridden
  get shortTitle(): string {
    return this.title;
  }

  get title(): string {
    throw new Error('Subclasses of Step must implement a title getter');
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotColor: 'green',
        dotType: 'static',
        text: 'Completed',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'static',
        text: 'In progress...',
      };
    } else if (this.status === 'not_started') {
      return {
        dotType: 'none',
        text: 'Not started',
      };
    } else if (this.status === 'locked') {
      return {
        dotType: 'none',
        text: 'Locked',
      };
    } else {
      return null;
    }
  }

  get type(): 'IntroductionStep' | 'SetupStep' | 'CourseStageStep' | 'CourseCompletedStep' {
    throw new Error('Subclasses of Step must implement a routeParams getter');
  }

  get isHidden(): boolean {
    return false; // All steps are visible by default
  }
}
