import Controller from '@ember/controller';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CodeExamplesController extends Controller {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked isLoading = true;
  @tracked solutions = [];
  @service store;
  @tracked requestedLanguage = null; // This shouldn't be state on the controller, see if we can move it to a query param or so?

  get communitySolutionsAreAvailableForCurrentLanguage() {
    return this.courseStage.hasCommunitySolutionsForLanguage(this.currentLanguage);
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

    return sortedBetaOrLiveLanguages.find((language) => this.courseStage.hasCommunitySolutionsForLanguage(language)) || sortedBetaOrLiveLanguages[0];
  }

  get repository() {
    return this.model.activeRepository;
  }

  get sortedSolutions() {
    return this.solutions; // For now, the API handles sorting
  }

  @action
  handleRequestedLanguageChange(language) {
    if (language === this.repository.language) {
      this.requestedLanguage = null;
    } else {
      this.requestedLanguage = language;
    }

    this.loadSolutions();
  }

  @action
  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.courseStage.id,
      language_id: this.currentLanguage.id,
      include: 'user,language,comments,comments.user,comments.target,course-stage',
    });

    this.isLoading = false;
  }
}
