import Component from '@glimmer/component';
import type { Hint } from 'codecrafters-frontend/models/course-stage-solution';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    hints: Hint[];
  };
}

export default class HintCardList extends Component<Signature> {
  @tracked expandedHintIndex: number | null = null;

  @action
  handleHintCardHeaderClick(hintIndex: number): void {
    if (this.expandedHintIndex === hintIndex) {
      this.expandedHintIndex = null;
    } else {
      this.expandedHintIndex = hintIndex;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::HintCardList': typeof HintCardList;
  }
}
