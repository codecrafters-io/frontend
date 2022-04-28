import Component from '@glimmer/component';

export default class CoursePageContentStepListSetupItemRequestedLanguagesPromptComponent extends Component {
  get willLetYouKnowText() {
    return `We'll let you know when ${this.args.requestedLanguages.mapBy('name').join('/')} support is available.`;
  }
}
