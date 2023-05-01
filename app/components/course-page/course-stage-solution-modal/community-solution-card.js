import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked explanationIsExpanded = false;
  @tracked containerElement;
  @service store;
  @service('current-user') currentUserService;

  get explanationNeedsTruncation() {
    return this.args.solution.explanationMarkdown && this.args.solution.explanationMarkdown.length > 200;
  }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return null;
    }
  }

  get explanationHTMLTruncated() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown.slice(0, 200) + '...'));
    } else {
      return null;
    }
  }

  @action
  handleDidInsert(element) {
    this.containerElement = element;
  }

  @action
  handleExpandButtonClick() {
    this.isExpanded = true;

    this.store
      .createRecord('analytics-event', {
        name: 'viewed_community_course_stage_solution',
        properties: {
          community_course_stage_solution_id: this.args.solution.id,
        },
      })
      .save();
  }

  @action handleExpandExplanationButtonClick() {
    this.explanationIsExpanded = true;
  }

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
    this.containerElement.scrollIntoView({ behavior: 'smooth' });
  }

  @action handleCollapseExplanationButtonClick() {
    this.explanationIsExpanded = false;
    this.containerElement.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get shouldShowExplanation() {
    return this.isExpanded && this.explanationHTML && this.currentUserService.record.isStaff;
  }
}
