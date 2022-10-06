import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SubmitCourseIdeaCardComponent extends Component {
  @service('current-user') currentUserService;
}
