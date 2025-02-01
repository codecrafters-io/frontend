import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    name: string;
    isComplete: boolean;
    estimatedReadingTimeInMinutes: number;
  };
}

export default class TrackConceptItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TrackConceptItem: typeof TrackConceptItemComponent;
  }
}
