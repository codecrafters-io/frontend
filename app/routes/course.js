import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CourseRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model(params) {
    let courses = this.store.findAll('course', { include: 'stages.solutions.language,supported-languages' });

    let repositories = this.store.findAll('repository', {
      include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
    });

    return RSVP.hash({
      courseSlug: params.course_slug,
      courses: courses,
      repositories: repositories,
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    model.repositories.filter((repo) => !repo.id || !repo.firstSubmissionCreated).forEach((repo) => this.store.unloadRecord(repo));
    model.repositories = this.store.peekAll('repository');
    controller.set('model', model);

    if (!model.repositories.findBy('id', controller.selectedRepositoryId)) {
      controller.selectedRepositoryId = null;
    }

    controller.set(
      'newRepository',
      this.store.createRecord('repository', { course: model.courses.findBy('slug', model.courseSlug), user: this.currentUser.record })
    );
  }
}
