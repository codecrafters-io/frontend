import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked containerElement;
  @service store;

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCollapsed() {
    return !this.isExpanded;
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
}
