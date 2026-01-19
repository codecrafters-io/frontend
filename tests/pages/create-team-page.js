import { clickable, create, fillable, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnCreateTeamButton: clickable('[data-test-create-team-button]'),
  header: Header,
  fillInTeamNameInput: fillable('#team_name_input'),
  visit: visitable('/teams/create'),
});
