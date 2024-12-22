import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: RepositoryModel;
  };
}

export default class SelectLanguageProficiencyLevelSectionComponent extends Component<Signature> {
  transition = fade;

  get feedbackAlertMarkdown() {
    const languageDescriptor = this.args.repository.language ? this.args.repository.language.name : 'this language';

    if (this.args.repository.languageProficiencyLevel === 'never_tried') {
      return `First time with ${languageDescriptor} and want to get familiar with its core syntax first? [Browse](https://docs.codecrafters.io/community/learning-resources) our recommended learning resources.`;
    } else if (this.args.repository.languageProficiencyLevel === 'beginner') {
      return `If you're just starting out with ${languageDescriptor}, CodeCrafters can be a good way to learn. To brush up on ${languageDescriptor} syntax first, [check out](https://docs.codecrafters.io/community/learning-resources#picking-up-language-basics) our recommended learning resources.`;
    } else if (this.args.repository.languageProficiencyLevel === 'intermediate') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to improve. We recommend using our **Code Examples** feature to see code from other users.`;
    } else if (this.args.repository.languageProficiencyLevel === 'advanced') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to further your mastery. If you get stuck, you can use our **Code Examples** feature to see code from other users.`;
    } else {
      return null;
    }
  }

  @action
  async handleSelect(proficiencyLevel: RepositoryModel['languageProficiencyLevel']) {
    if (this.args.isDisabled) {
      return;
    }

    if (!this.args.repository.isSaving) {
      this.args.repository.languageProficiencyLevel = proficiencyLevel;

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::Legacy::CreateRepositoryCard::SelectLanguageProficiencyLevelSection': typeof SelectLanguageProficiencyLevelSectionComponent;
  }
}
