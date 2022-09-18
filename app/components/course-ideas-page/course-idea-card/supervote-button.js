import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SupervoteButtonComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
  @service store;

  @tracked isSupervoting = false;
}
