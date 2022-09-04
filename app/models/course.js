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
  @attr('string') shortName;
  @attr('string') slug;
  @attr() testimonials; // free-form JSON

  @hasMany('course-language-configuration', { async: false }) languageConfigurations;
  @hasMany('course-stage', { async: false }) stages;

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

  availableLanguageConfigurationsForUser(user) {
    return this.languageConfigurations.filter((languageConfiguration) => languageConfiguration.isAvailableForUser(user));
  }

  get betaOrLiveLanguages() {
    return this.languageConfigurations.rejectBy('releaseStatusIsAlpha').mapBy('language');
  }

  get logoUrl() {
    return {
      redis: '/assets/images/challenge-logos/challenge-logo-redis.svg',
      docker: '/assets/images/challenge-logos/challenge-logo-docker.svg',
      git: '/assets/images/challenge-logos/challenge-logo-git.svg',
      sqlite: '/assets/images/challenge-logos/challenge-logo-sqlite.svg',
      react: '/assets/images/challenge-logos/challenge-logo-react.svg',
      grep: '/assets/images/challenge-logos/challenge-logo-grep.svg',
    }[this.slug];
  }

  get roundedCompletionPercentage() {
    return this.completionPercentage; // Same for now, we don't store exact completion percentages yet.
  }

  get sortedStages() {
    return this.stages.sortBy('position');
  }

  trackIntroductionMarkdownFor(language) {
    if (this.isRedis) {
      if (language.isGo) {
        return `
Discover concurrent programming in ${language.name} with goroutines, while also learning about TCP servers,
network programming, and the Redis Protocol.`;
      } else {
        return `
Discover concurrent programming in ${language.name} while also learning about TCP servers,
network programming, and the Redis Protocol.`;
      }
    } else if (this.isDocker) {
      if (language.isGo) {
        return `
Learn what a Docker image really is, and how it's stored in the Docker registry. Get your feel wet with systems
programming in ${language.name}. Learn to execute other programs with \`exec\` and to use \`syscall\` for Linux-specific calls.`;
      } else {
        return `
Learn what a Docker image really is, and how it's stored in the Docker registry. Get your feel wet with systems
programming in ${language.name}. Learn about chroot, kernel namespaces & more.`;
      }
    } else if (this.isGit) {
      return `
Dive into the internals of Git. Discover how Git stores and moves around data, its transfer protocols, and more. A
unique exercise in making network requests with ${language.name}.`;
    } else if (this.isSQLite) {
      return `
Learn about B-Trees, the foundation of every relational database. Explore ${language.name}'s API for reading/writing
files, and handling custom file formats.`;
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
