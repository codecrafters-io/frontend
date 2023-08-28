import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  };

  Blocks: {
    default: [];
  };
}

export default class BetaCourseLabelComponent extends Component<Signature> {
  get tooltipSide(): 'top' | 'bottom' | 'left' | 'right' {
    return this.args.tooltipSide || 'top';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BetaCourseLabel: typeof BetaCourseLabelComponent;
  }
}
