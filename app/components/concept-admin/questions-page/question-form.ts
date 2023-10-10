import Component from '@glimmer/component';
import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
  };
}

export default class QuestionFormComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::QuestionsPage::QuestionForm': typeof QuestionFormComponent;
  }
}
