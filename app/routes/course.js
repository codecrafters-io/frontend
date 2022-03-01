import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CourseRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  async model(params) {
    let modelPromises = {};
    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    modelPromises.course = courses.findBy('slug', params.course_slug);

    modelPromises.repositories = this.store
      .findAll('repository', {
        include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
      })
      .then((results) => {
        results = results.filter((result) => {
          return result.course.id === modelPromises.course.id;
        });

        return A(results.toArray());
      });

    return RSVP.hash(modelPromises);
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    if (!model.repositories.findBy('id', controller.selectedRepositoryId)) {
      controller.selectedRepositoryId = null;
    }

    controller.set('newRepository', this.store.createRecord('repository', { course: model.course, user: this.currentUser.record }));
  }
}
