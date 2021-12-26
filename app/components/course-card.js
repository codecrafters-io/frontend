import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service router;

  @action
  async navigateToCourse() {
    await this.router.transitionTo('course', this.args.course.slug, { queryParams: { fresh: null } });
  }
}
