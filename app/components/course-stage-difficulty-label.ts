import Component from '@glimmer/component';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
  };
}

export default class CourseStageDifficultyLabel extends Component<Signature> {
  get barColorClass() {
    return {
      very_easy: 'bg-teal-500 dark:bg-teal-600',
      easy: 'bg-teal-500 dark:bg-teal-600',
      medium: 'bg-teal-500 dark:bg-teal-600',
      hard: 'bg-yellow-500 dark:bg-yellow-600',
    }[this.args.stage.difficulty];
  }

  get label() {
    return {
      very_easy: 'Very easy',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    }[this.args.stage.difficulty];
  }

  get labelColorClass() {
    return {
      very_easy: 'text-teal-500',
      easy: 'text-teal-500',
      medium: 'text-teal-500',
      hard: 'text-yellow-500',
    }[this.args.stage.difficulty];
  }

  get numberOfBars() {
    return {
      very_easy: 0,
      easy: 1,
      medium: 2,
      hard: 3,
    }[this.args.stage.difficulty];
  }

  get tooltipText() {
    const expectedTime = {
      very_easy: '< 5 minutes',
      easy: '5-10 minutes',
      medium: '30 minutes to 1 hour',
      hard: 'more than 1 hour',
    }[this.args.stage.difficulty];

    return `We'd expect a proficient developer to take ${expectedTime} to complete this stage.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseStageDifficultyLabel: typeof CourseStageDifficultyLabel;
  }
}
