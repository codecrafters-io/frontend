import { action } from '@ember/object';
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
    return this.args.concept.questions
      .filter((question) => {
        return this.usedQuestionSlugs.includes(question.slug);
      })
      .sort((a, b) => a.queryMarkdown.localeCompare(b.queryMarkdown));
  }

  get enabledQuestions() {
    return this.args.concept.questions
      .filter((question) => {
        return !this.usedQuestionSlugs.includes(question.slug);
      })
      .sort((a, b) => a.queryMarkdown.localeCompare(b.queryMarkdown));
  }

  get remainingQuestionCount() {
    return (this.args.concept.questions.length as number) - this.usedQuestionSlugs.length;
  }

  get usedQuestionSlugs() {
    const questionSlugs = this.args.concept.parsedBlocks
      .filter((block): block is ConceptQuestionBlock => block.type === 'concept_question')
      .map((block) => block.conceptQuestionSlug);

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
