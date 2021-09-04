import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  repositoryPoller;
  transition = fade;

  @action
  async handleDidInsert() {
    this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility });
  }

  @action
  async handleWillDestroy() {
    this.repositoryPoller.stop();
  }

  get instructionsHTML() {
    // TODO: Handle language etc.
    return htmlSafe(new showdown.Converter().makeHtml(this.args.courseStage.descriptionMarkdownTemplate));
  }

  @action
  async onPoll() {
    if (this.isComplete) {
      this.args.onComplete();
      this.repositoryPoller.stop();
    }
  }

  get isComplete() {
    return false;
  }
}
