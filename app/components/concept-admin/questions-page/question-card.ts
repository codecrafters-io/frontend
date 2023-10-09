import Component from '@glimmer/component';
import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
  };
}

export default class QuestionCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::QuestionsPage::QuestionCard': typeof QuestionCardComponent;
  }
}
