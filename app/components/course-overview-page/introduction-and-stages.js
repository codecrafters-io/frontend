import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CourseOverviewPageIntroductionAndStagesComponent extends Component {
  @service store;

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.course.descriptionMarkdown));
  }
}
