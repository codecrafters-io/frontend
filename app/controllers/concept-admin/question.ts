import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class QuestionController extends Controller {
  @service router!: RouterService;

  declare model: {
    question: ConceptQuestionModel;
  };

  get tabs() {
    return [
      {
        slug: 'edit',
        title: 'Edit',
      },
      {
        slug: 'preview',
        title: 'Preview',
      },
    ];
  }

  get unsavedChangesArePresent() {
    return this.model.question.hasDirtyAttributes as unknown as boolean;
  }

  @action
  async handleDiscardChangesButtonClick() {
    await this.model.question.rollbackAttributes();
  }

  @action
  async handlePublishButtonClick() {
    await this.model.question.save();
    await this.router.transitionTo('concept-admin.question', this.model.question.slug);
  }
}
