import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import fade from 'ember-animated/transitions/fade';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
  };
}

export default class LanguageGuideCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked requestedLanguage: LanguageModel | null = null;

  loadLanguageGuidesTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-stage-language-guide', {
      course_stage_id: this.args.courseStage.id,
      include: 'course-stage,language',
    });
  });

  get currentLanguage(): LanguageModel | null {
    return this.requestedLanguage || this.defaultLanguage;
  }

  get defaultLanguage(): LanguageModel | null {
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

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return this.args.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }

  @action
  handleExpand(): void {
    if (this.languageGuide) {
      this.languageGuide.createView();
    }
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel): void {
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
