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

  @equal('releaseStatus', 'alpha') releaseStatusIsAlpha;
  @equal('releaseStatus', 'beta') releaseStatusIsBeta;
  @equal('releaseStatus', 'live') releaseStatusIsLive;

  get logoUrl() {
    return {
      redis: '/assets/images/challenge-logos/challenge-logo-redis.svg',
      docker: '/assets/images/challenge-logos/challenge-logo-docker.svg',
      git: '/assets/images/challenge-logos/challenge-logo-git.svg',
      sqlite: '/assets/images/challenge-logos/challenge-logo-sqlite.svg',
    }[this.slug];
  }

  get roundedCompletionPercentage() {
    return this.completionPercentage; // Same for now, we don't store exact completion percentages yet.
  }

  get sortedStages() {
    return this.stages.sortBy('position');
  }

  trackIntroductionMarkdownFor(language) {
    if (language.isGo) {
      return `Docker helps you set up & deploy any project quickly despite code environment differences. You’ll build your own version of Docker from scratch — it’s the ideal way to explore OS level concepts in Go.`;
    } else {
      return `Docker helps you set up & deploy any project quickly despite code environment differences. You’ll build your own version of Docker from scratch — it’s the ideal way to explore OS level concepts in ${language.name}.`;
    }
  }

  get numberOfStages() {
    return this.stages.length;
  }

  get sortPositionForTrack() {
    return (
      {
        redis: 1,
        docker: 2,
        git: 3,
        sqlite: 4,
      }[this.slug] || 5
    );
  }
}
