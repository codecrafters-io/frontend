import Component from '@glimmer/component';

export default class RequestedLanguagesPromptComponent extends Component {
  get willLetYouKnowText() {
    return `We'll let you know once ${this.args.requestedAndUnsupportedLanguages.mapBy('name').join(' / ')} support is available on this challenge.`;
  }
}
