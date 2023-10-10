import ConceptModel from 'codecrafters-frontend/models/concept';
import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class BlocksController extends Controller {
  declare model: { concept: ConceptModel };
  @service declare store: Store;

  @action
  async handleAddQuestionButtonClick() {
    const question = this.store.createRecord('concept-question', {
      concept: this.model.concept,
    });

    await question.save();
  }
}
