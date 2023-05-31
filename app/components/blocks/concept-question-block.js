import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ConceptQuestionBlockComponent extends Component {
  @service store;

  get question() {
    return this.store.peekAll('concept-question').findBy('slug', this.args.model.conceptQuestionSlug);
  }
}
