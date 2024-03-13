import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseModel from 'codecrafters-frontend/models/course';

export type ModelType = {
  stage: CourseStageModel;
};

export default class StageInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { stage_slug: string }): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    const stage = course.stages.find((stage) => stage.slug === params.stage_slug) as CourseStageModel;

    (await this.store.query('course-stage-participation-analysis', {
      course_id: course.id,
    })) as unknown as CourseStageParticipationAnalysisModel[];

    return {
      stage: stage,
    };
  }
}
