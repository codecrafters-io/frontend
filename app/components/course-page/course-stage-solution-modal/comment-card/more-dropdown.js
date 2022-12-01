import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MoreDropdownComponent extends Component {
  @action
  handleEditButtonClick(dropdownActions) {
    dropdownActions.close();

    return this.args.onEditButtonClick();
  }
}
