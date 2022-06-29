import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

import 'prismjs/components/prism-diff';

export default class CourseStageSolutionModalComponent extends Component {
  @tracked isViewingExplanation; // explanation/diff
  @tracked requestedLanguage;

  constructor() {
    super(...arguments);

    this.requestedLanguage = this.args.repositoryLanguage || this.args.courseStage.solutions.firstObject.language;

    if (this.solution.hasExplanation) {
      this.isViewingExplanation = true;
    }
  }

  @action
  handleViewDiffLinkClick() {
    this.isViewingExplanation = false;
  }

  @action
  handleViewExplanationLinkClick() {
    this.isViewingExplanation = true;
  }

  @action
  handleRequestedLanguageChange(requestedLanguage) {
    this.requestedLanguage = requestedLanguage;
  }

  get isViewingDiff() {
    return !this.isViewingExplanation;
  }

  get solution() {
    const solutionForRequestedLanguage = this.args.courseStage.solutions.findBy('language', this.requestedLanguage);

    return solutionForRequestedLanguage ? solutionForRequestedLanguage : this.args.courseStage.solutions.firstObject;
  }
}
