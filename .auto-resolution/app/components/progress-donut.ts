import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template/-private/handlebars';

interface Signature {
  Element: Element;

  Args: {
    total: number;
    completed: number;
    color?: 'blue' | 'teal' | 'gray';
  };
}

export default class ProgressDonut extends Component<Signature> {
  get color(): 'blue' | 'teal' | 'gray' {
    return this.args.color ?? 'blue';
  }

  get colorClassesForBaseCircle(): string {
    return {
      blue: 'stroke-blue-100 dark:stroke-blue-900',
      teal: 'stroke-teal-100 dark:stroke-teal-900',
      gray: 'stroke-gray-100 dark:stroke-gray-900',
    }[this.color];
  }

  get colorClassesForProgressCircle(): string {
    return {
      blue: 'stroke-blue-500',
      teal: 'stroke-teal-500',
      gray: 'stroke-gray-500',
    }[this.color];
  }

  get isComplete(): boolean {
    return this.args.total > 0 && this.args.completed >= this.args.total;
  }

  get progressPercentage(): number {
    if (this.args.total === 0) {
      return 0;
    }

    // Apply minimum width of 10%
    return Math.max(10, (100 * this.args.completed) / this.args.total);
  }

  get progressStyle(): SafeString {
    const targetOffset = (2 * Math.PI * 9 * (100 - this.progressPercentage)) / 100;

    return htmlSafe(`--target-offset: ${targetOffset}`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ProgressDonut: typeof ProgressDonut;
  }
}
