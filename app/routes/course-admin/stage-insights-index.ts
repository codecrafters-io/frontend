import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';

export type ModelType = {
  course: CourseModel;
};

export default class StageInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    return {
      course: course,
    };
  }
}
