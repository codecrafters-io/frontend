import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

export type ModelType = {
  course: CourseModel;
  stageParticipationAnalyses: CourseStageParticipationAnalysisModel[];
};

export default class StageInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    const stageParticipationAnalyses = (await this.store.query('course-stage-participation-analysis', {
      course_id: course.id,
    })) as unknown as CourseStageParticipationAnalysisModel[];

    return {
      course: course,
      stageParticipationAnalyses,
    };
  }
}
