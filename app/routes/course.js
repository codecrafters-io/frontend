import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class CourseRoute extends Route {
  @service currentUser;
  @service store;

  async model(params) {
    await this.currentUser.authenticate();

    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    let course = courses.findBy('slug', params.course_slug);

    let repositories = await this.store.query('repository', {
      course_id: course.id,
      include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
    });

    return {
      course: course,
      repositories: A(repositories.toArray()),
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.set('newRepository', this.store.createRecord('repository', { course: model.course, user: this.currentUser.record }));
  }
}
