import Component from '@glimmer/component';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languageGuide: CourseStageLanguageGuideModel;
  };
}

export default class SimpleLanguageGuideCardComponent extends Component<Signature> {
  @service declare store: Store;

  @action
  handleExpand(): void {
    this.args.languageGuide.createView();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SimpleLanguageGuideCard': typeof SimpleLanguageGuideCardComponent;
  }
}
