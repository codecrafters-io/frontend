import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template/-private/handlebars';

interface Signature {
  Element: HTMLSpanElement;

  Args: {
    text: string;
    duration?: number;
    spread?: number;
  };
}

export default class TextShimmer extends Component<Signature> {
  get duration(): number {
    return this.args.duration ?? 1.5;
  }

  get dynamicSpread(): number {
    return this.args.text.length * this.spread;
  }

  get spread(): number {
    return this.args.spread ?? 2;
  }

  get style(): SafeString {
    return htmlSafe(`--shimmer-duration: ${this.duration}s; --shimmer-spread: ${this.dynamicSpread}px;`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TextShimmer: typeof TextShimmer;
  }
}
