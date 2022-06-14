import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @attr('string') explanationMarkdown;
  @attr('') changedFiles; // free-form JSON
  @attr('string') githubUrl;

  get hasExplanation() {
    return !!this.explanationMarkdown;
  }
}
