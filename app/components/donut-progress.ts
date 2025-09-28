import Component from '@glimmer/component';

interface Signature {
  Element: SVGElement;

  Args: {
    total: number;
    completed: number | undefined;
  };
}

export default class DonutProgress extends Component<Signature> {
  get isComplete(): boolean {
    return this.args.total > 0 && (this.args.completed || 0) >= this.args.total;
  }

  get targetOffset(): number {
    if (this.args.total === 0) {
      return 62.83; // Full circle (no progress)
    }

    const actualProgress = (this.args.completed || 0) / this.args.total;
    // Apply minimum width of 10% for visual appeal, but only if there's actual progress
    const minProgress = actualProgress > 0 ? Math.max(0.1, actualProgress) : 0;

    return Math.round(62.83 - 62.83 * minProgress);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DonutProgress: typeof DonutProgress;
  }
}
