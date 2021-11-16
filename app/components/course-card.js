import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service currentUser;
  @service router;

  @action
  async navigateToCourse() {
    await this.router.transitionTo('course', this.args.course.slug, { queryParams: { fresh: null } });
  }

  get shouldShowFreeLabel() {
    return this.args.course.isFree && !this.currentUser.hasActiveSubscription;
  }
}
