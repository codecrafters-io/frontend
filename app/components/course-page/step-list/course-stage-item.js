import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';
import Mustache from 'mustache';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.instructionsMarkdown));
  }

  get instructionsMarkdown() {
    const variables = {};

    this.store.peekAll('language').forEach((language) => {
      variables[`lang_is_${language.slug}`] = this.args.repository.language === language;
    });

    variables['readme_url'] = this.args.repository.readmeUrl || this.args.repository.defaultReadmeUrl;

    return Mustache.render(this.args.courseStage.descriptionMarkdownTemplate, variables);
  }

  get status() {
    if (this.args.repository.lastSubmissionIsEvaluating && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'evaluating';
    }

    if (this.args.repository.highestCompletedStage && this.args.repository.highestCompletedStage.get('position') >= this.args.courseStage.position) {
      return 'complete';
    }

    if (
      this.args.repository.lastSubmissionIsRecent &&
      this.args.repository.lastSubmissionHasFailureStatus &&
      this.args.repository.lastSubmission.courseStage === this.args.courseStage
    ) {
      return 'failed';
    }

    if (this.args.repository.activeStage === this.args.courseStage) {
      return 'waiting';
    } else {
      return 'locked';
    }
  }

  get statusIsComplete() {
    return this.status === 'complete';
  }

  get statusIsLocked() {
    return this.status === 'locked';
  }
}
