import { cancel, later } from '@ember/runloop';

export default class RepositoryPoller {
  isActive;
  repository;
  scheduledPoll;
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
    await this.store.query('repository', {
      course_id: this.repository.course.get('id'),
      include: 'language,course,user',
    });
  }

  scheduleDelayedPoll() {
    this.scheduledPoll = later(
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
      5000
    );
  }

  start(repository, onPoll) {
    this.repository = repository;
    this.isActive = true;
    this.onPoll = onPoll || (() => {});
    this.scheduleDelayedPoll();
  }

  stop() {
    this.isActive = false;
    cancel(this.scheduledPoll);
  }
}
