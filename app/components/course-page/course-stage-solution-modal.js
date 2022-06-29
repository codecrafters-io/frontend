import Component from '@glimmer/component';
import Prism from 'prismjs';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

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

  constructor() {
    super(...arguments);

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

  get isViewingDiff() {
    return !this.isViewingExplanation;
  }

  get solution() {
    const solutionForRequestedLanguage = this.args.courseStage.solutions.findBy('language', this.args.requestedLanguage);

    return solutionForRequestedLanguage ? solutionForRequestedLanguage : this.args.courseStage.solutions.firstObject;
  }

  get currentLanguage() {
    return this.solution.language;
  }
}
