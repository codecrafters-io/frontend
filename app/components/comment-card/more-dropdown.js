import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MoreDropdown extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleDeleteButtonClick(dropdownActions) {
    dropdownActions.close();

    return this.args.onDeleteButtonClick();
  }

  @action
  handleEditButtonClick(dropdownActions) {
    dropdownActions.close();

    return this.args.onEditButtonClick();
  }

  @action
  handleToggleRejectedChildCommentsButtonClick(dropdownActions) {
    dropdownActions.close();

    return this.args.onToggleRejectedChildCommentsButtonClick();
  }
}
