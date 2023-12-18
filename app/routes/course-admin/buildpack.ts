import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';

export default class BuildpackRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { buildpack_id: string }) {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;
    await this.store.query('buildpack', { course_id: course.id, include: 'language,course' });

    const buildpack = course.buildpacks.findBy('id', params.buildpack_id);

    return {
      course: course,
      buildpack: buildpack,
    };
  }
}
