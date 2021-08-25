import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HeaderAccountDropdownComponent extends Component {
  @service serverVariables;
  @service('currentUser') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  handleGetHelpClick(dropdownActions) {
    window.Beacon('open');
    dropdownActions.close();
  }

  @action
  handleLogoutClick() {
    // https://stackoverflow.com/a/24766685
    let f = document.createElement('form');
    f.action = `${this.serverVariables.get('serverUrl')}/logout`;
    f.method = 'POST';
    // f.target='_blank';

    document.body.appendChild(f);
    f.submit();
  }
}
