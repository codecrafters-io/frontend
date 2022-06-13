import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseOverviewResumeTrackButtonComponent extends Component {
  @service currentUser;
  @service router;

  get activeCourse() {
    return this.args.courses.find((course) => {
      return !this.currentUser.record.repositories
        .filterBy('course', course)
        .filterBy('language', this.args.language)
        .some((repository) => repository.allStagesAreComplete);
    });
  }

  @action
  handleClicked() {
    // TODO: Handle "resume-track functionality?"
    this.router.transitionTo('course', (this.activeCourse || this.args.courses.lastObject).slug);
  }
}
