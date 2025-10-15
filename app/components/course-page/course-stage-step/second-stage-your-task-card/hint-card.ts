import Component from '@glimmer/component';
import type { Hint } from 'codecrafters-frontend/models/course-stage-language-guide';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    hint: Hint;
    hintIndex: number;
  };
}

export default class HintCard extends Component<Signature> {
  transition = fade;
  @tracked isExpanded = false;

  @action
  handleHeaderClick(): void {
    this.isExpanded = !this.isExpanded;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::HintCard': typeof HintCard;
  }
}
