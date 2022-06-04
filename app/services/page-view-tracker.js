import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service router;
  @service store;

  @action
  handleRouteChange(transition) {
    if (this.#shouldIgnoreEventForTransition(transition)) {
      return;
    }

    this.#buildAnalyticsEvent().save();
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }

  #buildAnalyticsEvent() {
    if (this.router.currentRouteName === 'course') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'course-overview') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_overview_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'courses') {
      return this.store.createRecord('analytics-event', { name: 'viewed_course_list_page' });
    } else if (this.router.currentRouteName === 'pay') {
      return this.store.createRecord('analytics-event', { name: 'viewed_payment_prompt' });
    } else if (this.router.currentRouteName === 'course_stage_solution.diff') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_stage_solution_diff',
        properties: {
          course_slug: this.router.currentRoute.parent.params.course_slug,
          course_stage_slug: this.router.currentRoute.parent.params.stage_slug,
          language_slug: 'go', // hard-coded for now
        },
      });
    } else if (this.router.currentRouteName === 'course_stage_solution.explanation') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_stage_solution_explanation',
        properties: {
          course_slug: this.router.currentRoute.parent.params.course_slug,
          course_stage_slug: this.router.currentRoute.parent.params.stage_slug,
          language_slug: 'go', // hard-coded for now
        },
      });
    } else if (this.router.currentRouteName === 'track') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_track_page',
        properties: { track_slug: this.router.currentRoute.params.track_slug },
      });
    } else if (this.router.currentRouteName === 'tracks') {
      return this.store.createRecord('analytics-event', { name: 'viewed_track_list_page' });
    } else {
      return this.store.createRecord('analytics-event', { name: 'viewed_unknown_page', properties: { url: this.router.currentURL } });
    }
  }

  #shouldIgnoreEventForTransition(transition) {
    if (!transition.from || !transition.to) {
      return false; // First page load, not reason to ignore
    }

    if (transition.from.name !== transition.to.name) {
      return false;
    }

    if (!isEqual(transition.from.params, transition.to.params)) {
      return false;
    }

    // Route name & params are the same, only query params differ.
    return true;
  }
}
