import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    onSurveyComplete: () => void;
  };

  Element: HTMLDivElement;
};

export default class OnboardingSurveyWizardComponent extends Component<Signature> {
  fade = fade;
  @tracked currentStep = 1;
  @service declare router: RouterService;

  @action
  async handleContinueButtonClick() {
    if (this.currentStep === 2) {
      this.args.onboardingSurvey.status = 'complete';
      await this.args.onboardingSurvey.save();
      this.args.onSurveyComplete();
    } else {
      this.currentStep++;
    }
  }

  @action
  handleSurveyUpdated() {
    this.updateSurvey.perform();
  }

  updateSurvey = task({ keepLatest: true }, async (): Promise<void> => {
    this.args.onboardingSurvey.save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard': typeof OnboardingSurveyWizardComponent;
  }
}
