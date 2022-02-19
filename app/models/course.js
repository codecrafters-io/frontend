import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

export default class CourseModel extends Model {
  @attr('number') completionPercentage;
  @attr('string') descriptionMarkdown;
  @attr('string') difficulty;
  @attr('string') name;
  @attr('string') releaseStatus;
  @attr('string') shortDescriptionMarkdown;
  @attr('string') slug;
  @hasMany('course-stage', { async: false }) stages;
  @hasMany('language', { async: false }) supportedLanguages;
  @attr() testimonials; // free-form JSON

  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

  @equal('slug', 'docker') isDocker;
  @equal('slug', 'git') isGit;
  @equal('slug', 'react') isReact;
  @equal('slug', 'redis') isRedis;
  @equal('slug', 'sqlite') isSQLite;

  @equal('releaseStatus', 'beta') releaseStatusIsBeta;
  @equal('releaseStatus', 'live') releaseStatusIsLive;

  get roundedCompletionPercentage() {
    return this.completionPercentage; // Same for now, we don't store exact completion percentages yet.
  }

  get sortedStages() {
    return this.stages.sortBy('position');
  }
}
