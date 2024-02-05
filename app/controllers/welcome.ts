import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/welcome';
import window from 'ember-window-mock';

export default class WelcomeController extends Controller {
  declare model: ModelType;

  // ?next is a query param used to redirect the user to a specific page after they've completed the onboarding survey.
  // We store it in a tracked property so that we can remove it from the URL until the user has completed the survey.
  @tracked next: string | undefined = undefined;
  @tracked stashedNext: string | undefined = undefined;

  @service declare router: RouterService;

  @action
  handleDidInsertContainer() {
    // Store the value of the ?next query param so that we can redirect the user to it after they've completed the survey.
    // We don't want a long URL visible in the address bar while the user is filling out the survey.
    if (this.next) {
      this.stashedNext = this.next;
      this.router.transitionTo({ queryParams: { next: null } }); // reset param
    }
  }

  @action
  handleSurveyCompleted() {
    // If no URL was specified, redirect to the catalog
    if (!this.stashedNext) {
      this.router.transitionTo('catalog');

      return;
    }

    try {
      new URL(this.stashedNext);
      window.location.href = this.stashedNext;
    } catch (e) {
      console.error(`${this.stashedNext} is not a valid URL`);
      this.router.transitionTo('catalog'); // Fallback to 'catalog' if not a valid URL
    }
  }
}
