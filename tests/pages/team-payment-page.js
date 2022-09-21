import { clickable, collection, fillable, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  teamDetailsForm: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    fillInTeamName: fillable('#team_name_input'),
    fillInContactEmail: fillable('#contact_email_input'),
    scope: '[data-test-team-details-form]',
  },
  visit: visitable('/teams/pay'),
});
