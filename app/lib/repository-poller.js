import Poller from 'codecrafters-frontend/lib/poller';

export default class RepositoryPoller extends Poller {
  static defaultIncludedResources = [
    'language',
    'course',
    'user',
    'course-stage-completions',
    'course-stage-completions.course-stage',
    'course-stage-feedback-submissions',
    'course-stage-feedback-submissions.course-stage',
    'last-submission',
    'last-submission.course-stage',
  ].join(',');

  async doPoll() {
    return await this.store.query('repository', {
      course_id: this.model.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });
  }
}
