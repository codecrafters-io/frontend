import { attr, hasMany } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';
import reactLogo from '/assets/images/challenge-logos/challenge-logo-react.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';

export default class CourseModel extends Model {
  @attr('number') completionPercentage;
  @attr('string') definitionRepositoryFullName;
  @attr('string') descriptionMarkdown;
  @attr('string') difficulty;
  @attr('string') name;
  @attr('string') releaseStatus;
  @attr('string') sampleExtensionIdeaTitle;
  @attr('string') sampleExtensionIdeaDescription;
  @attr('string') shortDescriptionMarkdown;
  @attr('string') shortName;
  @attr('string') slug;
  @attr('string') testerRepositoryFullName;
  @attr() testimonials; // free-form JSON

  @hasMany('course-definition-update', { async: false }) definitionUpdates;
  @hasMany('course-extension-idea', { async: false }) extensionIdeas;
  @hasMany('course-language-configuration', { async: false }) languageConfigurations;
  @hasMany('course-stage', { async: false }) stages;
  @hasMany('course-tester-version', { async: false }) testerVersions;

  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

  @equal('slug', 'docker') isDocker;
  @equal('slug', 'git') isGit;
  @equal('slug', 'grep') isGrep;
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

  get definitionRepositoryLink() {
    return `https://github.com/${this.definitionRepositoryFullName}`;
  }

  get firstStage() {
    return this.sortedStages[0];
  }

  get logoUrl() {
    return {
      redis: redisLogo,
      docker: dockerLogo,
      git: gitLogo,
      sqlite: sqliteLogo,
      react: reactLogo,
      grep: grepLogo,
      'http-server': grepLogo, // temporary
      'dns-server': grepLogo, // temporary
      bittorrent: grepLogo, // temporary
      interpreter: grepLogo, // temporary
    }[this.slug];
  }

  get roundedCompletionPercentage() {
    return this.completionPercentage; // Same for now, we don't store exact completion percentages yet.
  }

  get secondStage() {
    return this.sortedStages[1];
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
Learn what a Docker image really is, and how it's stored in the Docker registry. Get your feet wet with systems
programming in ${language.name}. Learn to execute other programs with \`exec\` and to use \`syscall\` for Linux-specific calls.`;
      } else {
        return `
Learn what a Docker image really is, and how it's stored in the Docker registry. Get your feet wet with systems
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
    } else if (this.isGrep) {
      return `
Learn about regular expressions and how they're evaluated. Implement your own version of \`grep\` in ${language.name}.`;
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
        grep: 5,
      }[this.slug] || 6
    );
  }

  get testerRepositoryLink() {
    return `https://github.com/${this.testerRepositoryFullName}`;
  }
}

CourseModel.prototype.syncCourseDefinitionUpdates = memberAction({
  path: 'sync-course-definition-updates',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

CourseModel.prototype.syncCourseTesterVersions = memberAction({
  path: 'sync-course-tester-versions',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
