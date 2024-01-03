import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { action } from '@ember/object';

export default class CommunityCourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'communitySolutions' }) courseStage;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;

  @hasMany('community-course-stage-solution-comment', { async: false, inverse: 'target' }) comments;

  @attr('') changedFiles; // free-form JSON
  @attr('string') explanationMarkdown;
  @attr('string') commitSha;
  @attr('string') githubRepositoryName;
  @attr('boolean') githubRepositoryIsPrivate;
  @attr('date') submittedAt;
  @attr('boolean') isRestrictedToTeam; // if true, only fellow team members can see this solution

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }

  get isPublishedToGithub() {
    return this.githubRepositoryName;
  }

  get isPublishedToPublicGithubRepository() {
    return this.isPublishedToGithub && !this.githubRepositoryIsPrivate;
  }

  @action
  githubUrlForFile(filename) {
    return `https://github.com/${this.githubRepositoryName}/blob/${this.commitSha}/${filename}`;
  }
}
