import Component from '@glimmer/component';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import fade from 'ember-animated/transitions/fade';

type RepositoryModel = {
  id: null | string;
  language: null | { name: string };
  languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  save(): Promise<void>;
};

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class SelectLanguageProficiencyLevelSectionComponent extends Component<Signature> {
  transition = fade;

  get feedbackAlertMarkdown() {
    const languageDescriptor = this.args.repository.language ? this.args.repository.language.name : 'this language';

    if (this.args.repository.languageProficiencyLevel === 'never_tried') {
      return `We recommend learning basic ${
        this.args.repository.language ? this.args.repository.language.name : ''
      } syntax before attempting this challenge. [Exercism](https://exercism.org) is a good place to start.`;
    } else if (this.args.repository.languageProficiencyLevel === 'beginner') {
      return ` If you're just starting out with ${languageDescriptor}, CodeCrafters can be a good way to learn. We recommend using our **Code Examples** feature to see code from other users before attempting each stage.`;
    } else if (this.args.repository.languageProficiencyLevel === 'intermediate') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to improve. We recommend using our **Code Examples** feature to see code from other users.`;
    } else if (this.args.repository.languageProficiencyLevel === 'advanced') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to further your mastery. If you get stuck, you can use our **Code Examples** feature to see code from other users.`;
    } else {
      return null;
    }
  }

  get feedbackAlertHtml() {
    if (this.feedbackAlertMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.feedbackAlertMarkdown));
    } else {
      return null;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectLanguageProficiencyLevelSection': typeof SelectLanguageProficiencyLevelSectionComponent;
  }
}
