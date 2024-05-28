import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type RouterService from '@ember/routing/router-service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';

export type CodeExampleEvaluatorRouteModel = {
  course: CourseModel;
  languages: LanguageModel[];
  evaluator: CommunitySolutionEvaluatorModel;
  filteredLanguageSlugs: string[];
  filteredCourseStageSlugs: string[];
  passEvaluations: CommunitySolutionEvaluationModel[];
  failEvaluations: CommunitySolutionEvaluationModel[];
  unsureEvaluations: CommunitySolutionEvaluationModel[];
};

export default class CodeExampleEvaluatorRoute extends BaseRoute {
  @service declare store: Store;
  @service declare router: RouterService;

  queryParams = {
    languages: {
      refreshModel: true,
    },
    course_stage_slugs: {
      refreshModel: true,
    },
  };


  async loadEvaluations(
    evaluator: CommunitySolutionEvaluatorModel,
    course: CourseModel,
    languageSlugsFilter: string[],
    courseStageSlugsFilter: string[],
    resultFilter: string,
  ): Promise<CommunitySolutionEvaluationModel[]> {
    const filters: Record<string, string> = {
      course_id: course.id,
    };

    if (resultFilter) {
      filters['result'] = resultFilter;
    }

    if (languageSlugsFilter.length > 0) {
      filters['language_slugs'] = languageSlugsFilter.join(',');
    }

    if (courseStageSlugsFilter.length > 0) {
      filters['course_stage_slugs'] = courseStageSlugsFilter.join(',');
    }

    return (await this.store.query('community-solution-evaluation', {
      ...filters,
      ...{
        evaluator_id: evaluator.id,
        include: [
          'community-solution',
          'community-solution.user',
          'community-solution.language',
          'community-solution.course-stage',
          'evaluator',
        ].join(','),
      },
    })) as unknown as CommunitySolutionEvaluationModel[];
  }

  async model(params: { evaluator_slug: string; languages: string; course_stage_slugs: string }): Promise<CodeExampleEvaluatorRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course;

    const evaluators = await this.store.query('community-solution-evaluator', {
      include: ['course', 'language'].join(','),
    });

    const evaluator = evaluators.find((evaluator) => evaluator.slug === params.evaluator_slug);

    if (!evaluator) {
      this.router.transitionTo('not-found');

      return {} as CodeExampleEvaluatorRouteModel;
    }

    const languageSlugs = params.languages.split(',');
    const courseStageSlugs = params.course_stage_slugs.split(',');

    return {
      course: course,
      languages: (await this.store.findAll('language')) as unknown as LanguageModel[],
      evaluator: evaluator,
      passEvaluations: await this.loadEvaluations(evaluator, course, languageSlugs, courseStageSlugs, 'pass'),
      failEvaluations: await this.loadEvaluations(evaluator, course, languageSlugs, courseStageSlugs, 'fail'),
      unsureEvaluations: await this.loadEvaluations(evaluator, course, languageSlugs, courseStageSlugs, 'unsure'),
      filteredLanguageSlugs: params.languages.split(','),
      filteredCourseStageSlugs: params.course_stage_slugs.split(','),
    };
  }
}
