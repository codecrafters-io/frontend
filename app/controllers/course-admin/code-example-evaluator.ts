import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type { CodeExampleEvaluatorRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-evaluator';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import { task } from 'ember-concurrency';

export default class CodeExampleEvaluatorController extends Controller {
  declare model: CodeExampleEvaluatorRouteModel;

  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = ['languages', 'usernames', 'course_stage_slugs'];
  languages = '';
  usernames = '';
  course_stage_slugs = '';

  @tracked passEvaluations: CommunitySolutionEvaluationModel[] = [];
  @tracked failEvaluations: CommunitySolutionEvaluationModel[] = [];
  @tracked unsureEvaluations: CommunitySolutionEvaluationModel[] = [];

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
    return this.model.allLanguages.filter((language) => this.model.filteredLanguageSlugs.includes(language.slug));
  }

  get isLoadingEvaluations() {
    return this.loadEvaluationsTask.isRunning;
  }

  get sortedLanguagesForDropdown() {
    return this.model.course.betaOrLiveLanguages.toSorted(fieldComparator('name'));
  }

  buildContextFilters(_course: CourseModel, languageSlugsFilter: string[], courseStageSlugsFilter: string[]): Record<string, string> {
    // TODO: Add a course_id filter if the evaluator is course-specific
    const filters: Record<string, string> = {};

    if (languageSlugsFilter.length > 0) {
      filters['language_slugs'] = languageSlugsFilter.join(',');
    }

    if (courseStageSlugsFilter.length > 0) {
      filters['course_stage_slugs'] = courseStageSlugsFilter.join(',');
    }

    return filters;
  }

  async fetchEvaluations(
    evaluator: CommunitySolutionEvaluatorModel,
    course: CourseModel,
    languageSlugsFilter: string[],
    courseStageSlugsFilter: string[],
    resultFilter: string,
  ): Promise<CommunitySolutionEvaluationModel[]> {
    const filters = this.buildContextFilters(course, languageSlugsFilter, courseStageSlugsFilter);

    if (resultFilter) {
      filters['result'] = resultFilter;
    }

    return (await this.store.query('community-solution-evaluation', {
      ...filters,
      ...{
        evaluator_id: evaluator.id,
        limit: 30,
        include: [
          'community-solution',
          'community-solution.user',
          'community-solution.language',
          'community-solution.course-stage',
          'community-solution.trusted-evaluations',
          'community-solution.trusted-evaluations.community-solution',
          'community-solution.trusted-evaluations.creator',
          'community-solution.trusted-evaluations.evaluator',
          'evaluator',
        ].join(','),
      },
    })) as unknown as CommunitySolutionEvaluationModel[];
  }

  async fetchTrustedEvaluations(
    evaluator: CommunitySolutionEvaluatorModel,
    course: CourseModel,
    languageSlugsFilter: string[],
    courseStageSlugsFilter: string[],
  ): Promise<void> {
    const filters = this.buildContextFilters(course, languageSlugsFilter, courseStageSlugsFilter);

    await this.store.query('trusted-community-solution-evaluation', {
      ...filters,
      ...{
        evaluator_id: evaluator.id,
        include: [
          'creator',
          'community-solution',
          'community-solution.user',
          'community-solution.language',
          'community-solution.course-stage',
          'community-solution.evaluations',
          'evaluator',
        ].join(','),
      },
    });
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
  async handleDidInsert() {
    await this.loadEvaluationsTask.perform();
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

  loadEvaluationsTask = task({ keepLatest: true }, async (): Promise<void> => {
    const { evaluator, course, filteredLanguageSlugs, filteredCourseStageSlugs } = this.model;

    // Load all evaluations in parallel
    const [passEvaluations, failEvaluations, unsureEvaluations] = await Promise.all([
      this.fetchEvaluations(evaluator, course, filteredLanguageSlugs, filteredCourseStageSlugs, 'pass'),
      this.fetchEvaluations(evaluator, course, filteredLanguageSlugs, filteredCourseStageSlugs, 'fail'),
      this.fetchEvaluations(evaluator, course, filteredLanguageSlugs, filteredCourseStageSlugs, 'unsure'),
      this.fetchTrustedEvaluations(evaluator, course, filteredLanguageSlugs, filteredCourseStageSlugs),
    ]);

    this.passEvaluations = passEvaluations;
    this.failEvaluations = failEvaluations;
    this.unsureEvaluations = unsureEvaluations;
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
