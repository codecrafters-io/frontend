import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import type { TemporaryCourseStageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/lib/temporary-types';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
    courseStage: TemporaryCourseStageModel;
  };
}

export default class LanguageGuideCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  loadLanguageGuidesTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-stage-language-guide', {
      course_stage_id: this.args.courseStage.id,
      include: 'course-stage,language',
    });
  });

  get isLoading(): boolean {
    return this.loadLanguageGuidesTask.isRunning;
  }

  // Can return undefined if the language guide hasn't been loaded yet
  get languageGuide() {
    if (!this.args.repository.language) {
      return undefined;
    }

    return this.args.courseStage.languageGuides.findBy('language', this.args.repository.language);
  }

  @action
  handleExpand(): void {
    console.log('expand clicked', !!this.languageGuide);

    if (this.languageGuide) {
      this.languageGuide.createView();
    }
  }

  @action
  loadLanguageGuides(): void {
    this.loadLanguageGuidesTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::LanguageGuideCard': typeof LanguageGuideCardComponent;
  }
}
