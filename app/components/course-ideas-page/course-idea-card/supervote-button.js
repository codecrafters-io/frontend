import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SupervoteButtonComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
  @service store;

  @tracked isSupervoting = false;

  @action
  async handleClick() {
    if (this.currentUserService.isAnonymous) {
      window.location.href = '/login?next=' + this.router.currentURL;
    }

    if (this.isSupervoting) {
      return;
    }

    this.isSupervoting = true;
    await this.store.createRecord('course-idea-supervote', { courseIdea: this.args.courseIdea, user: this.currentUserService.record }).save();
    this.isSupervoting = false;
  }
}
