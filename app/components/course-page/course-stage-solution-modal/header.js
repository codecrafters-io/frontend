import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service currentUser;

  get currentUserIsStaff() {
    return this.currentUser.record.isStaff;
  }
}
