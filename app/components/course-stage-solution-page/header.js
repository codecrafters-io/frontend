import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseStageSolutionPageHeaderComponent extends Component {
  @service router;

  get diffLinkIsActive() {
    return this.router.currentRouteName === 'course-stage-solution.diff';
  }

  get explanationLinkIsActive() {
    return this.router.currentRouteName === 'course-stage-solution.explanation';
  }
}
