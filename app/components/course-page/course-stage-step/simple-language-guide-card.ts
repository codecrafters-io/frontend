import Component from '@glimmer/component';
import { action } from '@ember/object';
import type CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languageGuide: CourseStageLanguageGuideModel;
  };
}

export default class SimpleLanguageGuideCard extends Component<Signature> {
  @action
  handleExpand(): void {
    this.args.languageGuide.createView();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SimpleLanguageGuideCard': typeof SimpleLanguageGuideCard;
  }
}
