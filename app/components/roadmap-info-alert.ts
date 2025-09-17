import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    heading: string;
  };
  Blocks: {
    default: [];
  };
}

export default class RoadmapInfoAlert extends Component<Signature> {
  transition = fade;

  @tracked rank: number | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    setTimeout(() => {
      this.rank = 15578;
    }, 1350);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RoadmapInfoAlert: typeof RoadmapInfoAlert;
  }
}
