import type RepositoryModel from 'codecrafters-frontend/models/repository';
import Poller from 'codecrafters-frontend/utils/poller';

export default class RepositoryPoller extends Poller {
  declare model: RepositoryModel;

  static defaultIncludedResources = [
    'course',
    'course-stage-completions',
    'course-stage-completions.course-stage',
    'course-stage-feedback-submissions',
    'course-stage-feedback-submissions.course-stage',
    'course.extensions',
    'extension-activations',
    'extension-activations.extension',
    'extension-activations.repository',
    'github-repository-sync-configurations',
    'language',
    'language.leaderboard',
    'last-submission',
    'last-submission.autofix-requests',
    // 'last-submission.autofix-requests.submission', // Hardcoded on backend to be included, doesn't seem to make a difference?
    'last-submission.course-stage',
    'last-submission.evaluations',
    'last-submission.repository',
    'stage-list',
    'stage-list.items',
    'stage-list.items.stage',
    'user',
  ].join(',');

  async doPoll() {
    await this.store.query('repository', {
      course_id: this.model.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });
  }
}
