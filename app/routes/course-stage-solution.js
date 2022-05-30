import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseStageSolutionRoute extends ApplicationRoute {
  @service store;

  async model() {
    const courses = await this.store.findAll('course', { include: 'stages.solutions,supported-languages' });
    const course = courses.findBy('slug', this.paramsFor('course-stage-solution').course_slug);
    const stage = course.stages.findBy('slug', this.paramsFor('course-stage-solution').stage_slug);

    // TODO: When we support multiple languages, filter by language
    return stage.solutions.firstObject;
  }
}
