import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class SelectLanguageProficiencyLevelStep extends Component<Signature> {
  // We store this so that we can display a continue button and handle the save when the user clicks the button
  @tracked unsavedProficiencyLevel: RepositoryModel['languageProficiencyLevel'] | undefined;

  transition = fade;

  get feedbackAlertMarkdown() {
    const languageDescriptor = this.args.repository.language ? this.args.repository.language.name : 'this language';

    if (this.optimisticProficiencyLevel === 'never_tried') {
      return `First time with ${languageDescriptor} and want to get familiar with its core syntax first? [Browse](https://docs.codecrafters.io/community/learning-resources) our recommended learning resources.`;
    } else if (this.optimisticProficiencyLevel === 'beginner') {
      return `If you're just starting out with ${languageDescriptor}, CodeCrafters can be a good way to learn. To brush up on ${languageDescriptor} syntax first, [check out](https://docs.codecrafters.io/community/learning-resources#picking-up-language-basics) our recommended learning resources.`;
    } else if (this.optimisticProficiencyLevel === 'intermediate') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to improve. We recommend using our **Code Examples** feature to see code from other users.`;
    } else if (this.optimisticProficiencyLevel === 'advanced') {
      return `If you're already familiar with ${languageDescriptor}, CodeCrafters can be a good way to further your mastery. If you get stuck, you can use our **Code Examples** feature to see code from other users.`;
    } else {
      return null;
    }
  }

  get optimisticProficiencyLevel() {
    return this.unsavedProficiencyLevel || this.args.repository.languageProficiencyLevel;
  }

  @action
  async handleContinueButtonClick() {
    if (!this.args.repository.isSaving) {
      this.args.repository.languageProficiencyLevel = this.unsavedProficiencyLevel!;
      await this.args.repository.save();
    }
  }

  @action
  async handleSelect(proficiencyLevel: RepositoryModel['languageProficiencyLevel']) {
    this.unsavedProficiencyLevel = proficiencyLevel;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard::CreateRepositoryQuestionnaire::SelectLanguageProficiencyLevelStep': typeof SelectLanguageProficiencyLevelStep;
  }
}
