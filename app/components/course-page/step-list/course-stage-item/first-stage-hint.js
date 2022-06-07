import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import moment from 'moment';
import showdown from 'showdown';
import Mustache from 'mustache';

export default class CoursePageStepListStageItemFirstStageHintComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get firstStageReadmeHintHTML() {
    showdown.extension('linkInNewTab', function () {
      return [
        {
          type: 'html',
          regex: /(<a [^>]+?)(>.*<\/a>)/g,
          replace: '$1 target="_blank"$2',
        },
      ];
    });

    return htmlSafe(new showdown.Converter({ extensions: ['linkInNewTab'] }).makeHtml(this.firstStageReadmeHintMarkdown));
  }

  get firstStageReadmeHintMarkdown() {
    const variables = {};

    variables['readme_url'] = this.args.repository.readmeUrl || this.args.repository.defaultReadmeUrl;

    return Mustache.render(this.firstStageReadmeHintMarkdownTemplate, variables);
  }

  get firstStageReadmeHintMarkdownTemplate() {
    return `Since this is your first stage, you can consult [**the README**]({{readme_url}}) in your repository for instructions on how to pass.`;
  }

  get solutionIsAvailable() {
    return !!this.args.courseStage.solutions.findBy('language', this.args.repository.language);
  }
}
