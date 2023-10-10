import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import ConceptModel from 'codecrafters-frontend/models/concept';
import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';

export default class ConceptAdminQuestionRoute extends BaseRoute {
  @service declare router: RouterService;

  afterModel(model: { question: ConceptQuestionModel | null }) {
    if (!model.question) {
      this.router.transitionTo('not-found');
    }
  }

  model(params: { question_slug: string }) {
    const concept = (this.modelFor('concept-admin') as { concept: ConceptModel }).concept;
    const question = concept.questions.find((question) => question.slug === params.question_slug);

    return {
      question: question,
    };
  }
}
