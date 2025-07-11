import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    heading: string;
  };
  Blocks: {
    default: [];
  };
}

export default class RoadmapInfoAlertComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RoadmapInfoAlert: typeof RoadmapInfoAlertComponent;
  }
}
