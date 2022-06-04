import Controller from '@ember/controller';
import Prism from 'prismjs';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-diff';

export default class CourseStageSolutionExplanationController extends Controller {
  get explanationHtml() {
    return htmlSafe(new showdown.Converter().makeHtml(this.model.explanationMarkdown));
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }
}
