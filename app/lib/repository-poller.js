import { later } from '@ember/runloop';

export default class RepositoryPoller {
  isActive;
  repository;
  store;

  constructor({ store }) {
    this.isActive = false;
    this.store = store;
    this.repository = null;
  }

  start(repository, onPoll) {
    this.repository = repository;
    this.isActive = true;
    this.onPoll = onPoll;
    this.scheduleDelayedPoll();
  }

  async poll() {
    await this.store.query('repository', { course_id: this.repository.course.get('id') });
  }

  scheduleDelayedPoll() {
    later(
      this,
      async function () {
        if (this.isActive) {
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

  stop() {
    this.isActive = false;
  }
}
