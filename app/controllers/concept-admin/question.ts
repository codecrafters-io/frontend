import Controller from '@ember/controller';
import { action } from '@ember/object';
import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';

export default class QuestionController extends Controller {
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
  }
}
