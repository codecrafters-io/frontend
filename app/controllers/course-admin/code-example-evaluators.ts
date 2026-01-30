import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import type { CodeExampleEvaluatorsRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-evaluators';
import { task } from 'ember-concurrency';

export default class CodeExampleEvaluatorsController extends Controller {
  declare model: CodeExampleEvaluatorsRouteModel;

  @service declare router: RouterService;
  @service declare store: Store;

  createEvaluatorTask = task({ drop: true }, async (): Promise<void> => {
    const evaluator = this.store.createRecord('community-solution-evaluator', {});

    await evaluator.save();

    this.router.transitionTo('course-admin.code-example-evaluator', this.model.course.slug, evaluator.slug);
  });

  @action
  @waitFor
  async handleCreateEvaluatorButtonClick() {
    await this.createEvaluatorTask.perform();
  }
}
