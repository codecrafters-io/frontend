import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MoreDropdownComponent extends Component {
  @service authenticator;

  get shouldShowDeleteButton() {
    return this.authenticator.currentUser && this.authenticator.currentUser.id === this.args.comment.user.id;
  }

  get shouldShowEditButton() {
    return this.authenticator.currentUser && this.authenticator.currentUser.id === this.args.comment.user.id;
  }

  get shouldShowEditInAdminPanelButton() {
    return this.authenticator.currentUser && this.authenticator.currentUser.isStaff;
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
}
