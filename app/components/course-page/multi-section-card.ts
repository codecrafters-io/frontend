import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export interface Section {
  title: string;
  descriptionWhenCollapsed: string | null; // Used when the section is collapsed
  isComplete: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    sections: Section[];
    expandedSection: Section | null;
    onSectionClick: (section: Section) => void;
  };

  Blocks: {
    expandedSection: [];
    header: [];
  };
}

export default class MultiSectionCard extends Component<Signature> {
  transition = fade;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::MultiSectionCard': typeof MultiSectionCard;
  }
}
