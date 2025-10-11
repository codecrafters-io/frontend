import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import * as Sentry from '@sentry/ember';
import { type StepDefinition } from 'codecrafters-frontend/components/expandable-step-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    preferredLanguageSlug: string | undefined;
    repository: RepositoryModel;
  };
}

class BaseStep {
  repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    this.repository = repository;
  }
}

class SelectLanguageStep extends BaseStep implements StepDefinition {
  id = 'select-language';
  canBeCompletedManually = false;

  get isComplete() {
    return !!this.repository.language;
  }

  get titleMarkdown() {
    return 'Preferred Language';
  }
}

class SelectLanguageProficiencyLevelStep extends BaseStep implements StepDefinition {
  id = 'select-language-proficiency-level';
  canBeCompletedManually = false;

  get isComplete() {
    return !!this.repository.languageProficiencyLevel;
  }

  get titleMarkdown() {
    return 'Language Proficiency';
  }
}

class SelectExpectedActivityFrequencyStep extends BaseStep implements StepDefinition {
  id = 'select-expected-activity-frequency';
  canBeCompletedManually = false;

  get isComplete() {
    return !!this.repository.expectedActivityFrequency;
  }

  get titleMarkdown() {
    return 'Practice Cadence';
  }
}

class SelectRemindersPreferenceStep extends BaseStep implements StepDefinition {
  id = 'select-reminders-preference';
  canBeCompletedManually = false;

  get isComplete() {
    return this.repository.remindersAreEnabled !== null && this.repository.remindersAreEnabled !== undefined;
  }

  get titleMarkdown() {
    return 'Accountability';
  }
}

export default class CreateRepositoryQuestionnaire extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked repositoryCreationErrorMessage: string | undefined;

  get allStepsComplete() {
    return this.steps.every((step) => step.isComplete);
  }

  get steps(): StepDefinition[] {
    return [
      new SelectLanguageStep(this.args.repository),
      new SelectLanguageProficiencyLevelStep(this.args.repository),
      new SelectExpectedActivityFrequencyStep(this.args.repository),
      new SelectRemindersPreferenceStep(this.args.repository),
    ];
  }

  @action
  async handleLanguageSelection(language: LanguageModel) {
    this.repositoryCreationErrorMessage = undefined;
    this.args.repository.language = language;

    try {
      await this.args.repository.save();
    } catch (error) {
      this.args.repository.language = undefined;
      this.repositoryCreationErrorMessage =
        'Failed to create repository, please try again? Contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);

      return;
    }

    this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard::CreateRepositoryQuestionnaire': typeof CreateRepositoryQuestionnaire;
  }
}
