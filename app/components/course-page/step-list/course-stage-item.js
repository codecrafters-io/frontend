import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get instructionsHTML() {
    // TODO: Handle language etc.
    return htmlSafe(new showdown.Converter().makeHtml(this.args.courseStage.descriptionMarkdownTemplate));
  }

  get isComplete() {
    return false;
  }
}
