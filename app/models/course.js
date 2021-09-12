import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

export default class CourseModel extends Model {
  @hasMany('course-stage', { async: false }) stages;
  @attr('string') descriptionMarkdown;
  @attr('string') difficulty;
  @attr('string') name;
  @attr('string') shortDescriptionMarkdown;
  @attr('string') slug;
  @hasMany('language', { async: false }) supportedLanguages;

  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

  @equal('slug', 'docker') isDocker;
  @equal('slug', 'git') isGit;
  @equal('slug', 'react') isReact;
  @equal('slug', 'redis') isRedis;
  @equal('slug', 'sqlite') isSQLite;

  get sortedStages() {
    return this.stages.sortBy('position');
  }
}
