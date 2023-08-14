import Component from '@glimmer/component';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

export default class WelcomeCardComponent extends Component {
  get courseDescriptionHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.repository.course.descriptionMarkdown));
  }
}
