import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';

export type ModelType = {
  courseStage: CourseStageModel;
  language: LanguageModel;
};

export default class CodeExampleInsightsRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { stage_slug: string }): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    const courseStage = course.stages.findBy('slug', params.stage_slug);

    // (await this.store.query('course-stage-participation-analysis', {
    //   course_id: course.id,
    //   include: 'stage',
    // })) as unknown as CourseStageParticipationAnalysisModel[];

    return {
      courseStage: courseStage,
      language: courseStage.course.betaOrLiveLanguages.findBy('slug', 'go'),
    };
  }
}
