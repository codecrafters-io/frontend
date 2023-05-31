import Component from '@glimmer/component';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

export default class MarkdownBlockComponent extends Component {
  get html() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.args.model.markdown));
  }
}
