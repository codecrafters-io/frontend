import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type { CodeExampleEvaluatorRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-evaluator';

export default class CodeExampleEvaluatorController extends Controller {
  declare model: CodeExampleEvaluatorRouteModel;

  @service declare router: RouterService;

  queryParams = ['languages', 'usernames', 'course_stage_slugs'];
  languages = '';
  usernames = '';
  course_stage_slugs = '';

  get currentCourseStage() {
    return this.filteredCourseStages[0] || null;
  }

  get currentLanguage() {
    return this.filteredLanguages[0] || null;
  }

  get filteredCourseStages() {
    return this.model.course.stages.filter((course_stage) => this.model.filteredCourseStageSlugs.includes(course_stage.slug));
  }

  get filteredLanguages() {
    return this.model.languages.filter((language) => this.model.filteredLanguageSlugs.includes(language.slug));
  }

  get sortedLanguagesForDropdown() {
    return this.model.course.betaOrLiveLanguages.sortBy('name');
  }

  @action
  handleAllCourseStagesDropdownLinkClick() {
    this.router.transitionTo({ queryParams: { course_stage_slugs: [] } });
  }

  @action
  handleAllLanguagesDropdownLinkClick() {
    this.router.transitionTo({ queryParams: { languages: [] } });
  }

  @action
  handleCourseStageChange(stage: CourseStageModel) {
    this.router.transitionTo({ queryParams: { course_stage_slugs: stage.slug } });
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo({ queryParams: { languages: language.slug } });
  }
}
