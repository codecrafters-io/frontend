import Component from '@glimmer/component';

export default class CoursePageContentStepListSetupItemRequestedLanguagesPromptComponent extends Component {
  get willLetYouKnowText() {
    return `We'll let you know once ${this.args.requestedLanguages.mapBy('name').join(' / ')} support is available on this challenge.`;
  }
}
