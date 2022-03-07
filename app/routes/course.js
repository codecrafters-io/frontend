import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CourseRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  model(params) {
    // Ideally we'd just do store.findRecord, but our backend currently doesn't support
    // fetching a single course. Let's instead fetch all and pass down params.course_slug
    // in the route's model.
    let courses = this.store.findAll('course', { include: 'supported-languages,stages' });

    let repositories = this.store.findAll('repository', {
      include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
    });

    return RSVP.hash({
      courseSlug: params.course_slug,
      courses: courses,
      repositories: repositories,
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    const repository = model.repositories.findBy('id', controller.selectedRepositoryId);

    if (!repository || !repository.firstSubmissionCreated) {
      controller.selectedRepositoryId = null;
    }

    controller.set(
      'newRepository',
      this.store.createRecord('repository', { course: model.courses.findBy('slug', model.courseSlug), user: this.currentUser.record })
    );
  }
}
