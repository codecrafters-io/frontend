import { action } from '@ember/object';
import Component from '@glimmer/component';
import { ConceptQuestionBlockDefinition } from 'codecrafters-frontend/utils/block-definitions';
import ConceptModel from 'codecrafters-frontend/models/concept';
import uniqReductor from 'codecrafters-frontend/utils/uniq-reductor';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: ConceptQuestionBlockDefinition;
    concept: ConceptModel;
  };
}

export default class ConceptQuestionBlockEditor extends Component<Signature> {
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
    return this.args.concept.parsedBlocks
      .filter((block): block is ConceptQuestionBlockDefinition => block.type === 'concept_question')
      .map((block) => block.conceptQuestionSlug)
      .reduce(uniqReductor(), []);
  }

  @action
  handleConceptQuestionSlugSelected(event: Event) {
    this.args.model.conceptQuestionSlug = (event.target! as HTMLSelectElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::ConceptQuestionBlockEditor': typeof ConceptQuestionBlockEditor;
  }
}
