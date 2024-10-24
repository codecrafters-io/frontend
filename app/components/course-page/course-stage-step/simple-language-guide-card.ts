import Component from '@glimmer/component';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    language?: LanguageModel;
  };
}

export default class SimpleLanguageGuideCardComponent extends Component<Signature> {
  @service declare store: Store;

  get languageGuide() {
    return this.args.courseStage.languageGuides.findBy('language', this.args.language);
  }

  @action
  handleExpand(): void {
    if (this.languageGuide) {
      this.languageGuide.createView();
    }
  }

  @action
  loadLanguageGuides(): void {
    this.loadLanguageGuidesTask.perform();
  }

  loadLanguageGuidesTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-stage-language-guide', {
      course_stage_id: this.args.courseStage.id,
      include: 'course-stage,language',
    });
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SimpleLanguageGuideCard': typeof SimpleLanguageGuideCardComponent;
  }
}
