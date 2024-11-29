import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languageGuide: CourseStageLanguageGuideModel;
  };
}

export default class EmbeddedLanguageGuideCardComponent extends Component<Signature> {
  @tracked explanationIsVisible = false;

  @action
  handleToggleExplanationButtonClick(): void {
    if (!this.explanationIsVisible) {
      this.args.languageGuide.createView();
    }

    this.explanationIsVisible = !this.explanationIsVisible;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::EmbeddedLanguageGuideCard': typeof EmbeddedLanguageGuideCardComponent;
  }
}
