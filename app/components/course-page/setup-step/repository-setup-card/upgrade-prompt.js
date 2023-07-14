import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UpgradePromptComponent extends Component {
  @service('router') router;

  @action
  handleSubscribeLinkClicked() {
    this.router.transitionTo('pay');
  }
}
