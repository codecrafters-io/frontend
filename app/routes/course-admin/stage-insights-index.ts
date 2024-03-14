import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

export type ModelType = {
  course: CourseModel;
};

export default class StageInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;

    (await this.store.query('course-stage-participation-analysis', {
      course_id: course.id,
      include: 'stage',
    })) as unknown as CourseStageParticipationAnalysisModel[];

    return {
      course: course,
    };
  }
}
