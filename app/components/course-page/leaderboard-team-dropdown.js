import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageRepositoryDropdownComponent extends Component {
  transition = fade;
  @service router;
  @tracked gitRepositoryURLWasCopiedRecently;

  @action
  async handleTeamLinkClick(team, dropdownActions) {
    dropdownActions.close();
    this.args.onChange(team);
  }
}
