import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked containerElement;
  @tracked currentTab;
  @service store;
  @service('current-user') currentUserService;

  constructor() {
    super(...arguments);

    this.currentTab = 'diff';
  }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return htmlSafe(new showdown.Converter().makeHtml(`This solution does not have an explanation yet.`));
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

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
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

  @action
  handleTabClick(tabId) {
    this.currentTab = tabId;
    this.isExpanded = true; // Expand when tabs are switched
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get shouldShowTabSwitcher() {
    return this.currentUserService.record.isStaff && this.args.solution.hasExplanation;
  }
}
