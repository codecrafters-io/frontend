import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import fade from 'ember-animated/transitions/fade';
import type { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/lib/temporary-types';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

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

  @tracked requestedLanguage: TemporaryLanguageModel | null = null;

  loadLanguageGuidesTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-stage-language-guide', {
      course_stage_id: this.args.courseStage.id,
      include: 'course-stage,language',
    });
  });

  get currentLanguage(): TemporaryLanguageModel | null {
    return this.requestedLanguage || this.defaultLanguage;
  }

  get defaultLanguage(): TemporaryLanguageModel | null {
    if (this.args.repository.language) {
      return this.args.repository.language;
    }

    return this.args.courseStage.languageGuides.sortBy('language.name')[0]?.language || null;
  }

  get isLoading(): boolean {
    return this.loadLanguageGuidesTask.isRunning;
  }

  // Can return undefined if the language guide hasn't been loaded yet
  get languageGuide() {
    if (!this.currentLanguage) {
      return undefined;
    }

    return this.args.courseStage.languageGuides.findBy('language', this.currentLanguage);
  }

  get sortedLanguagesForDropdown(): TemporaryLanguageModel[] {
    return this.args.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }

  @action
  handleExpand(): void {
    if (this.languageGuide) {
      this.languageGuide.createView();
    }
  }

  @action
  handleRequestedLanguageChange(language: TemporaryLanguageModel): void {
    this.requestedLanguage = language;
  }

  languageNameAnimationRules() {
    return fade;
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
