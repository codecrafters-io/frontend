import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service router;

  @action
  handleRouteChange() {
    if (this.router.currentRouteName === 'course') {
      console.log('Viewed course page', { course: this.router.currentRoute.params.course_slug });
    } else if (this.router.currentRouteName === 'course-overview') {
      console.log('Viewed course overview page', { course: this.router.currentRoute.params.course_slug });
    } else if (this.router.currentRouteName === 'courses') {
      console.log('Viewed courses listing');
    } else {
      console.log('Viewed unknown page', { url: this.router.currentURL });
    }
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange');
  }
}
