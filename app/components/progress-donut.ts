import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template/-private/handlebars';

interface Signature {
  Element: SVGElement;

  Args: {
    total: number;
    completed: number;
  };
}

export default class ProgressDonut extends Component<Signature> {
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
