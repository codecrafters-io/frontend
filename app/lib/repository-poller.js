import Poller from 'codecrafters-frontend/lib/poller';

export default class RepositoryPoller extends Poller {
  static defaultIncludedResources = [
    'language',
    'course',
    'course.stages',
    'course.extensions',
    'user',
    'user.badge-awards',
    'user.badge-awards.badge',
    'user.badge-awards.user',
    'user.badge-awards.submission',
    'user.badge-awards.submission.course-stage',
    'user.badge-awards.submission.repository',
    'course-stage-completions',
    'course-stage-completions.course-stage',
    'course-stage-feedback-submissions',
    'course-stage-feedback-submissions.course-stage',
    'github-repository-sync-configurations',
    'last-submission',
    'last-submission.course-stage',
    'last-submission.evaluations',
  ].join(',');

  async doPoll() {
    return await this.store.query('repository', {
      course_id: this.model.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });
  }
}
