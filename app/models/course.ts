import { attr, hasMany } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

import bittorrentLogo from '/assets/images/challenge-logos/challenge-logo-bittorrent.svg';
import dnsServerLogo from '/assets/images/challenge-logos/challenge-logo-dns-server.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';
import httpServerLogo from '/assets/images/challenge-logos/challenge-logo-http-server.svg';
import reactLogo from '/assets/images/challenge-logos/challenge-logo-react.svg';
import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';

export default class CourseModel extends Model {
  @attr('date') buildpacksLastSyncedAt!: Date;
  @attr('number') completionPercentage!: number;
  @attr() conceptSlugs!: string[];
  @attr('string') definitionRepositoryFullName!: string;
  @attr('string') descriptionMarkdown!: string;
  @attr('string') difficulty!: string;
  @attr('string') name!: string;
  @attr('string') releaseStatus!: string;
  @attr('string') sampleExtensionIdeaTitle!: string;
  @attr('string') sampleExtensionIdeaDescription!: string;
  @attr('string') shortDescriptionMarkdown!: string;
  @attr('string') shortName!: string;
  @attr('string') slug!: string;
  @attr('string') testerRepositoryFullName!: string;
  @attr() testimonials!: { [key: string]: string }; // free-form JSON

  @hasMany('buildpack', { async: false }) buildpacks;
  @hasMany('course-definition-update', { async: false }) definitionUpdates;
  @hasMany('course-extension-idea', { async: false }) extensionIdeas;
  @hasMany('course-extension', { async: false, inverse: 'course' }) extensions;
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

  get baseStages() {
    return this.stages.rejectBy('primaryExtensionSlug'); // TODO[Extensions]: Filter out stages with extensions
  }

  get betaOrLiveLanguages() {
    return this.languageConfigurations.rejectBy('releaseStatusIsAlpha').mapBy('language');
  }

  get concepts() {
    return this.store.peekAll('concept').filter((concept) => this.conceptSlugs.includes(concept.slug));
  }

  get definitionRepositoryLink() {
    return `https://github.com/${this.definitionRepositoryFullName}`;
  }

  get firstStage() {
    return this.sortedBaseStages[0];
  }

  get hasConcepts() {
    return this.conceptSlugs && this.conceptSlugs.length > 0;
  }

  get hasExtensions() {
    return this.extensions.length > 0;
  }

  get latestTesterVersion() {
    return this.testerVersions.find((testerVersion) => testerVersion.isLatest);
  }

  get logoUrl() {
    return (
      {
        bittorrent: bittorrentLogo,
        'dns-server': dnsServerLogo,
        docker: dockerLogo,
        git: gitLogo,
        grep: grepLogo,
        'http-server': httpServerLogo,
        react: reactLogo,
        redis: redisLogo,
        sqlite: sqliteLogo,
      }[this.slug] || grepLogo
    );
  }

  get roundedCompletionPercentage() {
    return this.completionPercentage; // Same for now, we don't store exact completion percentages yet.
  }

  get secondStage() {
    return this.sortedBaseStages[1];
  }

  get sortPositionForTrack() {
    return (
      {
        'http-server': 1,
        'dns-server': 2,
        bittorrent: 3,
        grep: 4,
        redis: 5,
        docker: 6,
        git: 7,
        sqlite: 8,
      }[this.slug] || 9
    );
  }

  // TODO[Extensions]: Should we include stages from extensions?
  get sortedBaseStages() {
    return this.baseStages.sortBy('position');
  }

  get sortedExtensions() {
    return this.extensions.sortBy('name');
  }

  get testerRepositoryLink() {
    return `https://github.com/${this.testerRepositoryFullName}`;
  }

  availableLanguageConfigurationsForUser(user) {
    return this.languageConfigurations.filter((languageConfiguration) => languageConfiguration.isAvailableForUser(user));
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
    } else if (this.slug === 'bittorrent') {
      return `
Learn about .torrent files and the famous BitTorrent protocol. Implement your own BitTorrent client in ${language.name}.`;
    }
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

CourseModel.prototype.syncBuildpacks = memberAction({
  path: 'sync-buildpacks',
  type: 'post',
});
