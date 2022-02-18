import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CourseOverviewPageStageListItemComponent extends Component {
  @service currentUser;
  @service store;

  get marketingHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.stage.marketingMarkdown));
  }

  get userHasStartedCourse() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('course', this.args.course).firstObject;
  }
}
