import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';

interface Signature {
  Element: HTMLDivElement;

  Args: { conceptGroup: ConceptGroupModel };
}

export default class Content extends Component<Signature> {
  get sortedConcepts() {
    return [...this.args.conceptGroup.concepts].sort((a, b) => {
      return this.args.conceptGroup.conceptSlugs.indexOf(a.slug) - this.args.conceptGroup.conceptSlugs.indexOf(b.slug);
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptGroupPage::Content': typeof Content;
  }
}
