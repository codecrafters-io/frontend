import { run } from '@ember/runloop';

export default class Poller {
  isActive;
  model;
  scheduledPollTimeoutId;
  store;

  constructor({ store, visibilityService }) {
    this.store = store;
    this.visibilityService = visibilityService;

    this.isActive = false;
    this.model = null;
  }

  get isPaused() {
    return this.visibilityService.isHidden;
  }

  async doPoll() {
    await this.store.query('repository', {
      course_id: this.model.course.get('id'),
      include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
    });
  }

  scheduleDelayedPoll() {
    this.scheduledPollTimeoutId = setTimeout(async () => {
      if (this.isActive && !this.isPaused) {
        run(async () => {
          let pollResult = await this.doPoll();
          this.onPoll(pollResult);
        });
      }

      if (this.isActive) {
        this.scheduleDelayedPoll();
      }
    }, 2000);
  }

  start(model, onPoll) {
    this.model = model;
    this.isActive = true;
    this.onPoll = onPoll || (() => {});
    this.scheduleDelayedPoll();
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.scheduledPollTimeoutId);
  }
}
