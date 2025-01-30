import type RepositoryModel from 'codecrafters-frontend/models/repository';
import Poller from 'codecrafters-frontend/utils/poller';

export default class RepositoryPoller extends Poller {
  declare model: RepositoryModel;

  static defaultIncludedResources = [
    'language',
    'extension-activations',
    'extension-activations.extension',
    'extension-activations.repository',
    'course',
    'course.extensions',
    'user',
    'user.badge-awards',
    'user.badge-awards.badge',
    'user.badge-awards.user',
    'user.badge-awards.course-stage-completion',
    'user.badge-awards.course-stage-completion.course-stage',
    'user.badge-awards.course-stage-completion.repository',
    'course-stage-completions',
    'course-stage-completions.course-stage',
    'course-stage-feedback-submissions',
    'course-stage-feedback-submissions.course-stage',
    'github-repository-sync-configurations',
    'last-submission',
    'last-submission.autofix-requests',
    // 'last-submission.autofix-requests.submission', // Hardcoded on backend to be included, doesn't seem to make a difference?
    'last-submission.course-stage',
    'last-submission.evaluations',
    'last-submission.repository',
    'stage-list',
    'stage-list.items',
    'stage-list.items.stage',
  ].join(',');

  async doPoll() {
    return await this.store.query('repository', {
      course_id: this.model.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });
  }
}
