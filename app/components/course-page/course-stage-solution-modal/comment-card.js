import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class CommentCardComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  get currentUser() {
    return this.currentUserService.record;
  }

  get currentUserIsStaff() {
    return this.currentUserService.record.isStaff;
  }

  get bodyHTML() {
    return htmlSafe(new showdown.Converter({ simplifiedAutoLink: true, openLinksInNewWindow: true }).makeHtml(this.args.comment.bodyMarkdown));
  }

  @action
  handleDidInsertBodyHTML(element) {
    Prism.highlightAllUnder(element);
  }
}
