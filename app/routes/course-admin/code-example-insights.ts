import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type CourseModel from 'codecrafters-frontend/models/course';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export type CodeExampleInsightsRouteModel = {
  courseStage: CourseStageModel;
  language: LanguageModel;
  solutions: CommunityCourseStageSolutionModel[];
};

export default class CodeExampleInsightsRoute extends BaseRoute {
  @service declare store: Store;

  queryParams = {
    language_slug: {
      refreshModel: true,
    },
    sort_mode: {
      refreshModel: true,
    },
  };

  async model(params: { stage_slug: string; language_slug?: string; sort_mode?: string }): Promise<CodeExampleInsightsRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course as CourseModel;
    const courseStage = course.stages.find((item) => item.slug === params.stage_slug);

    if (!courseStage) {
      throw new Error(`Course stage with slug "${params.stage_slug}" not found`);
    }

    const languages = course.betaOrLiveLanguages;

    // Default to the first language in the list
    let selectedLanguage: LanguageModel = languages.toSorted(fieldComparator('slug'))[0]!;

    if (params.language_slug) {
      const found = languages.find((l) => l.slug === params.language_slug);

      if (found) {
        selectedLanguage = found;
      }
    }

    return {
      courseStage: courseStage,
      language: selectedLanguage,
      solutions: (await this.store.query('community-course-stage-solution', {
        course_stage_id: courseStage.id,
        language_id: selectedLanguage.id,
        include: 'user,evaluations,evaluations.evaluator',
        order: params.sort_mode || 'newest',
        adapterOptions: {
          admin: true,
        },
      })) as unknown as CommunityCourseStageSolutionModel[],
    };
  }
}
