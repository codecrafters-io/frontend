import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommunitySolutionsTabComponent extends Component {
  @tracked isLoading = true;
  @tracked solutions = [];
  @service store;

  constructor() {
    super(...arguments);

    this.loadSolutions();
  }

  @action
  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.args.courseStage.id,
      language_id: this.args.requestedSolutionLanguage.id,
      include: 'user,language',
    });

    this.isLoading = false;
  }

  get sortedSolutions() {
    return this.solutions.sortBy('submittedAt').reverse();
  }
}
