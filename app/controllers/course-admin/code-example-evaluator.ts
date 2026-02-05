import Controller from '@ember/controller';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type { CodeExampleEvaluatorRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-evaluator';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

export default class CodeExampleEvaluatorController extends Controller {
  declare model: CodeExampleEvaluatorRouteModel;

  @service declare router: RouterService;
  @service declare store: Store;

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
    return this.model.course.betaOrLiveLanguages.toSorted(fieldComparator('name'));
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
  @waitFor
  async handleDeleteButtonClick() {
    await this.deleteTask.perform();
  }

  @action
  @waitFor
  async handleDeployButtonClick() {
    await this.deployTask.perform();
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo({ queryParams: { languages: language.slug } });
  }

  evaluateMoreSolutionsTask = task({ drop: true }, async (): Promise<void> => {
    const dummyRecord = this.store.createRecord('community-solution-evaluation') as CommunitySolutionEvaluationModel;

    await dummyRecord.generateForEvaluator({
      evaluator_id: this.model.evaluator.id,
      course_stage_id: this.currentCourseStage?.id,
      language_id: this.currentLanguage?.id,
    });

    dummyRecord.unloadRecord();
  });

  deleteTask = task({ drop: true }, async (): Promise<void> => {
    await this.model.evaluator.destroyRecord();
    this.router.transitionTo('course-admin.code-example-evaluators', this.model.course.slug);
  });

  deployTask = task({ drop: true }, async (): Promise<void> => {
    await this.model.evaluator.deploy({});
  });

  regenerateAllEvaluationsTask = task({ drop: true }, async (): Promise<void> => {
    await this.model.evaluator.regenerateAllEvaluations({});
  });

  updateSlugTask = task({ drop: true }, async (newSlug: string): Promise<void> => {
    this.model.evaluator.slug = newSlug;
    await this.model.evaluator.save();
    await this.router.replaceWith('course-admin.code-example-evaluator', this.model.course.slug, this.model.evaluator.slug).followRedirects();
  });
}
