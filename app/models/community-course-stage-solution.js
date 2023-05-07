import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CommunityCourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'communitySolutions' }) courseStage;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;

  @hasMany('community-course-stage-solution-comment', { async: false }) comments;

  @attr('') changedFiles; // free-form JSON
  @attr('string') explanationMarkdown;
  @attr('date') submittedAt;
  @attr('boolean') isRestrictedToTeam; // if true, only fellow team members can see this solution

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }
}
