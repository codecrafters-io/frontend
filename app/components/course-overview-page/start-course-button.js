import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartCourseButtonComponent extends Component {
  @service authenticator;

  get currentUserHasStartedCourse() {
    return this.authenticator.currentUser && this.authenticator.currentUser.hasStartedCourse(this.args.course);
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }
}
