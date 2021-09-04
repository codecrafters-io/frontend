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

  start(repository) {
    this.repository = repository;
    this.isActive = true;
    this.scheduleDelayedPoll();
  }

  async poll() {
    await this.store.query('repository', { course_id: this.repository.course.get('id') });

    if (this.repository.firstSubmissionCreated) {
      this.isActive = false;
    }
  }

  scheduleDelayedPoll() {
    later(
      this,
      async function () {
        if (this.isActive) {
          await this.poll();
        }

        if (this.isActive) {
          this.scheduleDelayedPoll();
        }
      },
      5000
    );
  }

  stop() {
    this.isActive = false;
  }
}
