import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service router;
  @service store;

  @action
  handleRouteChange() {
    if (this.router.currentRouteName === 'course') {
      this.store.createRecord('analytics-event', {
        name: 'viewed_course_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'course-overview') {
      this.store.createRecord('analytics-event', {
        name: 'viewed_course_overview_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'courses') {
      this.store.createRecord('analytics-event', { name: 'viewed_courses_listing_page' });
    } else {
      this.store.createRecord('analytics-event', { name: 'viewed_unknown_page', properties: { url: this.router.currentURL } });
    }
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
