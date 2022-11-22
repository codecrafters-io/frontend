import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default class CoursePageCourseStageSolutionExplanationComponent extends Component {
  get authorDetails() {
    return {
      name: 'Paul Kuruvilla',
      profileUrl: 'https://github.com/rohitpaulk',
      avatarUrl: 'https://github.com/rohitpaulk.png',
      headline: 'CTO, CodeCrafters',
    };
  }

  get reviewersDetails() {
    return [
      {
        name: 'Marcos Lilljedahl',
        profileUrl: 'https://www.docker.com/captains/marcos-lilljedahl/',
        avatarUrl: 'https://github.com/marcosnils.png',
        headline: 'Docker Contributor',
      },
    ];
  }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return htmlSafe(new showdown.Converter().makeHtml(`This solution does not have an explanation yet.`));
    }
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }
}
