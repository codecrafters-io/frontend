import { cancel, later, run } from '@ember/runloop';

export default class RepositoryPoller {
  isActive;
  repository;
  scheduledPollTimeoutId;
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
      include: 'language,course,user,course-stage-completions.course-stage,last-submission',
    });
  }

  scheduleDelayedPoll() {
    this.scheduledPollTimeoutId = setTimeout(async () => {
      if (this.isActive && !this.isPaused) {
        run(async () => {
          await this.poll();
          this.onPoll();
        });
      }

      if (this.isActive) {
        this.scheduleDelayedPoll();
      }
    }, 2000);
  }

  start(repository, onPoll) {
    this.repository = repository;
    this.isActive = true;
    this.onPoll = onPoll || (() => {});
    this.scheduleDelayedPoll();
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.scheduledPollTimeoutId);
  }
}
