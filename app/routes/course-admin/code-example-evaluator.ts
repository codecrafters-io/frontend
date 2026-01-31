import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type RouterService from '@ember/routing/router-service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type CodeExampleEvaluatorRouteModel = {
  course: CourseModel;
  allLanguages: LanguageModel[];
  evaluator: CommunitySolutionEvaluatorModel;
  filteredLanguageSlugs: string[];
  filteredCourseStageSlugs: string[];
};

export default class CodeExampleEvaluatorRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = {
    languages: {
      refreshModel: true,
    },
    course_stage_slugs: {
      refreshModel: true,
    },
  };

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
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

    return {
      course: course,
      allLanguages: (await this.store.findAll('language')) as unknown as LanguageModel[],
      evaluator: evaluator,
      filteredLanguageSlugs: params.languages.split(','),
      filteredCourseStageSlugs: params.course_stage_slugs.split(','),
    };
  }
}
