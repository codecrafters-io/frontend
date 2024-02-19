import { action, get } from '@ember/object';
import Component from '@glimmer/component';
import { ConceptQuestionBlock } from 'codecrafters-frontend/utils/blocks';
import ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: ConceptQuestionBlock;
    concept: ConceptModel;
  };
}

export default class ConceptQuestionBlockEditorComponent extends Component<Signature> {
  get disabledQuestions() {
    const usedSlugs = this.usedQuestionSlugs;

    return this.args.concept.questions
      .filter((question) => {
        return usedSlugs.includes(question.slug);
      })
      .sort((a, b) => a.queryMarkdown.localeCompare(b.queryMarkdown));
  }

  get enabledQuestions() {
    const usedSlugs = this.usedQuestionSlugs;

    return this.args.concept.questions
      .filter((question) => {
        return !usedSlugs.includes(question.slug);
      })
      .sort((a, b) => a.queryMarkdown.localeCompare(b.queryMarkdown));
  }

  get remainingQuestionCount() {
    const questions = this.args.concept.questions || [];

    // eslint-disable-next-line ember/no-get
    return get(questions, 'length') - this.usedQuestionSlugs.length;
  }

  get usedQuestionSlugs() {
    const questionSlugs = this.args.concept.blocks
      .filter((block) => block.type === 'concept_question')
      .map((block) => block.args['concept_question_slug']);

    return [...new Set(questionSlugs)];
  }

  @action
  handleConceptQuestionSlugSelected(event: Event) {
    this.args.model.conceptQuestionSlug = (event.target! as HTMLSelectElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::ConceptQuestionBlockEditor': typeof ConceptQuestionBlockEditorComponent;
  }
}
