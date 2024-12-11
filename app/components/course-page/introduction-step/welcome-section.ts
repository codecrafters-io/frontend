import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import LanguageModel from 'codecrafters-frontend/models/language';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class WelcomeSectionComponent extends Component<Signature> {
  @tracked repositoryCreationErrorMessage?: string;

  @action
  async handleLanguageSelection(language: LanguageModel) {
    this.repositoryCreationErrorMessage = undefined;
    this.args.repository.language = language;

    try {
      await this.args.repository.save(); // TODO: This is kinda slow, investigate ways to make it faster
    } catch (error) {
      this.args.repository.language = undefined;
      this.repositoryCreationErrorMessage =
        'Failed to create repository, please try again? Contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);

      return;
    }

    this.expandNextSection();

    this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeSection': typeof WelcomeSectionComponent;
  }
}
