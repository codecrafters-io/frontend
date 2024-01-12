import Controller from '@ember/controller';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type Store from '@ember-data/store';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

export default class CodeExamplesController extends Controller {
  declare model: {
    courseStage: CourseStageModel;
    activeRepository: RepositoryModel;
  };

  @service declare store: Store;

  rippleSpinnerImage = rippleSpinnerImage;
  @tracked orderType: 'recommended' | 'recent' | 'affiliated' = 'recent';
  @tracked isLoading = true;
  @tracked solutions: CommunityCourseStageSolutionModel[] = [];
  @tracked requestedLanguage: LanguageModel | null = null; // This shouldn't be state on the controller, see if we can move it to a query param or so?

  get communitySolutionsAreAvailableForCurrentLanguage() {
    return this.currentLanguage && this.courseStage.hasCommunitySolutionsForLanguage(this.currentLanguage);
  }

  get courseStage() {
    return this.model.courseStage;
  }

  get currentLanguage() {
    return this.requestedLanguage || this.defaultLanguage;
  }

  get defaultLanguage() {
    if (this.repository.language) {
      return this.repository.language;
    }

    const sortedBetaOrLiveLanguages = this.repository.course.betaOrLiveLanguages.sortBy('language.name');

    return (
      sortedBetaOrLiveLanguages.find((language) => this.courseStage.hasCommunitySolutionsForLanguage(language)) ||
      sortedBetaOrLiveLanguages[0] ||
      null
    );
  }

  get repository() {
    return this.model.activeRepository;
  }

  get sortedLanguagesForDropdown() {
    return this.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }

  get sortedSolutions() {
    return this.solutions; // For now, the API handles sorting
  }

  @action
  handleOrderTypeToggle() {
    // For now we only support toggling between these two
    if (this.orderType === 'recommended') {
      this.orderType = 'recent';
    } else {
      this.orderType = 'recommended';
    }

    this.loadSolutions();
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel | undefined) {
    if (!language) {
      return;
    }

    if (language === this.repository.language) {
      this.requestedLanguage = null;
    } else {
      this.requestedLanguage = language;
    }

    this.loadSolutions();
  }

  @action
  async loadSolutions() {
    if (!this.currentLanguage) {
      return;
    }

    this.isLoading = true;

    this.solutions = (await this.store.query('community-course-stage-solution', {
      course_stage_id: this.courseStage.id,
      language_id: this.currentLanguage.id,
      include: 'user,language,comments,comments.user,comments.target,course-stage',
      order: this.orderType,
    })) as unknown as CommunityCourseStageSolutionModel[]; // TODO: Doesn't store.query support model type inference?

    this.isLoading = false;
  }
}
