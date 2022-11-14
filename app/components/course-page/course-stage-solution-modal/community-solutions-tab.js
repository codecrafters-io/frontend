import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CommunitySolutionsTabComponent extends Component {
  @tracked isLoading = true;
  @tracked solutions = [];
  @service store;

  constructor() {
    super(...arguments);

    this.loadSolutions();
  }

  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.args.courseStage.id,
      language_id: this.args.requestedSolutionLanguage.id,
      include: 'users,language',
    });

    this.isLoading = false;
  }
}
