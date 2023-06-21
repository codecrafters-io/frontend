import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartCourseButtonComponent extends Component {
  @service authenticator;

  get currentUserHasStartedCourse() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('course', this.args.course).firstObject;
  }

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
