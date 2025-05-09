import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

export type ModelType = {
  courseStage: CourseStageModel;
  language: LanguageModel;
  solutions: CommunityCourseStageSolutionModel[];
};

export default class CodeExampleInsightsRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { stage_slug: string }): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    const courseStage = course.stages.findBy('slug', params.stage_slug);
    const language = courseStage.course.betaOrLiveLanguages.findBy('slug', 'go');

    // (await this.store.query('course-stage-participation-analysis', {
    //   course_id: course.id,
    //   include: 'stage',
    // })) as unknown as CourseStageParticipationAnalysisModel[];

    return {
      courseStage: courseStage,
      language: language,
      solutions: (await this.store.query('community-course-stage-solution', {
        course_stage_id: courseStage.id,
        language_id: language.id,
        include: 'user',
      })) as unknown as CommunityCourseStageSolutionModel[],
    };
  }
}
