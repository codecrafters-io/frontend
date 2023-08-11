import Component from '@glimmer/component';

export interface Section {
  title: string;
  collapsedTitle: string; // Used when the section is collapsed
  isComplete: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    sections: Section[];
    expandedSection: Section;
    onSectionClick: (section: Section) => void;
  };

  Blocks: {
    expandedSectionContent: [];
    headerContent: [];
  };
}

export default class MultiSectionCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::MultiSectionCard': typeof MultiSectionCardComponent;
  }
}
