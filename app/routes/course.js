import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import RSVP from 'rsvp';

export default class CourseRoute extends ApplicationRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model(params) {
    const includedCourseResources = [
      'stages.solutions.language',
      'stages.source-walkthrough',
      'language-configurations.language',
      'stages.screencasts',
      'stages.screencasts.language',
      'stages.screencasts.user',
    ];

    let courses = this.store.findAll('course', {
      include: includedCourseResources.join(','),
    });

    let repositories = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    });

    await this.authenticator.authenticate();

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
      this.store.createRecord('repository', { course: model.courses.findBy('slug', model.courseSlug), user: this.authenticator.currentUser })
    );
  }
}
