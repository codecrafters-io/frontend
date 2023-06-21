import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartCourseButtonComponent extends Component {
  @service authenticator;

  get currentUserHasStartedCourse() {
    return this.authenticator.currentUser && this.authenticator.currentUser.repositories.filterBy('course', this.args.course).firstObject;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }
}
