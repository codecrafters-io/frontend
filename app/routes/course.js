import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class CourseRoute extends AuthenticatedRoute {
  @service currentUser;
  @service store;

  async model(params) {
    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    let course = courses.findBy('slug', params.course_slug);

    let repositories = await this.store.query('repository', {
      course_id: course.id,
      include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
    });

    return {
      course: course,
      repositories: A(repositories.toArray()),
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    if (!model.repositories.findBy('id', controller.selectedRepositoryId)) {
      controller.selectedRepositoryId = null;
    }

    controller.set('newRepository', this.store.createRecord('repository', { course: model.course, user: this.currentUser.record }));
  }
}
