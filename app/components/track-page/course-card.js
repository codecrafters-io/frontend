import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class TrackPageCourseCardComponent extends Component {
  @service currentUser;

  get introductionHtml() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.course.trackIntroductionMarkdownFor(this.args.language)));
  }

  get shouldMaskContents() {
    return this.currentUser.isAnonymous;
  }
}
