import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

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
  };

  async model(params: { stage_slug: string; language_slug?: string }): Promise<CodeExampleInsightsRouteModel> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    console.log(params);
    const courseStage = course.stages.findBy('slug', params.stage_slug);
    const languages = course.betaOrLiveLanguages;
    const selectedLanguage = languages.findBy('slug', params.language_slug);

    console.log(course, courseStage, selectedLanguage);

    return {
      courseStage: courseStage,
      language: selectedLanguage,
      solutions: (await this.store.query('community-course-stage-solution', {
        course_stage_id: courseStage.id,
        language_id: selectedLanguage?.id,
        include: 'user',
        order: 'recommended',
      })) as unknown as CommunityCourseStageSolutionModel[],
    };
  }
}
