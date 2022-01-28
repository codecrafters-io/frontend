import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import moment from 'moment';
import showdown from 'showdown';
import Mustache from 'mustache';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get completedAt() {
    return this.args.repository.stageCompletedAt(this.args.courseStage);
  }

  get completedAtWasToday() {
    return this.completedAt && moment(this.completedAt).isSame(moment(), 'day');
  }

  get completedAtWasYesterday() {
    return this.completedAt && moment(this.completedAt).isSame(moment().subtract(1, 'day'), 'day');
  }

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.instructionsMarkdown));
  }

  get instructionsMarkdown() {
    const variables = {};

    this.store.peekAll('language').forEach((language) => {
      variables[`lang_is_${language.slug}`] = this.args.repository.language === language;
    });

    variables['readme_url'] = this.args.repository.readmeUrl || this.args.repository.defaultReadmeUrl;
    variables['starter_repo_url'] = this.args.repository.starterRepositoryUrl || this.args.repository.defaultStarterRepositoryUrl;

    return Mustache.render(this.args.courseStage.descriptionMarkdownTemplate, variables);
  }

  get lastFailedSubmissionWasWithinLast10Minutes() {
    return this.lastFailedSubmissionCreatedAt && new Date() - this.lastFailedSubmissionCreatedAt <= 600 * 1000; // in last 10 minutes
  }

  get lastFailedSubmissionCreatedAt() {
    if (this.args.repository.lastSubmissionHasFailureStatus) {
      return this.args.repository.lastSubmission.createdAt;
    } else {
      return null;
    }
  }

  get status() {
    if (this.args.repository.lastSubmissionIsEvaluating && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'evaluating';
    }

    if (this.args.repository.stageIsComplete(this.args.courseStage)) {
      return 'complete';
    }

    if (this.args.repository.lastSubmissionHasFailureStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
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

  get statusIsWaiting() {
    return this.status === 'waiting';
  }
}
