import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageStepListCourseStageItemUpgradePromptComponent extends Component {
  @service('globalModals') globalModalsService;

  @action
  handleSubscribeLinkClicked() {
    // TODO: Navigate to /upgrade page
  }
}
