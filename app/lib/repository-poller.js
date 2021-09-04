import { later } from '@ember/runloop';

export default class RepositoryPoller {
  isActive;
  repository;
  store;

  constructor({ store, visibilityService }) {
    this.store = store;
    this.visibilityService = visibilityService;

    this.isActive = false;
    this.repository = null;
  }

  get isPaused() {
    return this.visibilityService.isHidden;
  }

  async poll() {
    await this.store.query('repository', { course_id: this.repository.course.get('id') });
  }

  scheduleDelayedPoll() {
    later(
      this,
      async function () {
        if (this.isActive && !this.isPaused) {
          await this.poll();
          this.onPoll();
        }

        if (this.isActive) {
          this.scheduleDelayedPoll();
        }
      },
      1000
    );
  }

  start(repository, onPoll) {
    this.repository = repository;
    this.isActive = true;
    this.onPoll = onPoll;
    this.scheduleDelayedPoll();
  }

  stop() {
    this.isActive = false;
  }
}
