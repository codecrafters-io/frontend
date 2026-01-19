import Component from '@glimmer/component';
import type { Hint } from 'codecrafters-frontend/models/course-stage-solution';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    hint: Hint;
    hintIndex: number;
    isExpanded: boolean;
    onHeaderClick: () => void;
  };
}

export default class HintCard extends Component<Signature> {
  transition = fade;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::HintCard': typeof HintCard;
  }
}
