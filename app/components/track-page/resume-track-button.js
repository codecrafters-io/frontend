import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseOverviewResumeTrackButtonComponent extends Component {
  @service authenticator;
  @service router;

  get activeCourse() {
    if (!this.authenticator.currentUser) {
      return null;
    }

    return this.args.courses.find((course) => {
      return !this.authenticator.currentUser.repositories
        .filterBy('course', course)
        .filterBy('language', this.args.language)
        .some((repository) => repository.allStagesAreComplete);
    });
  }

  @action
  handleClicked() {
    this.router.transitionTo('course', (this.activeCourse || this.args.courses.at(-1)).slug);
  }
}
