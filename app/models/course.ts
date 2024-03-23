import BuildpackModel from 'codecrafters-frontend/models/buildpack';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';
import CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseLanguageConfigurationModel from 'codecrafters-frontend/models/course-language-configuration';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import DateService from 'codecrafters-frontend/services/date';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

import bittorrentLogo from '/assets/images/challenge-logos/challenge-logo-bittorrent.svg';
import dnsServerLogo from '/assets/images/challenge-logos/challenge-logo-dns-server.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';
import httpServerLogo from '/assets/images/challenge-logos/challenge-logo-http-server.svg';
import reactLogo from '/assets/images/challenge-logos/challenge-logo-react.svg';
import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';

type SyncBuildpacksResponse = { error: string } | { success: boolean };

export default class CourseModel extends Model {
  @attr('date') declare buildpacksLastSyncedAt: Date;
  @attr('number') declare completionPercentage: number;
  @attr() declare conceptSlugs: string[];
  @attr('string') declare definitionRepositoryFullName: string;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare difficulty: string;
  @attr('date') declare isFreeUntil: Date | null;
  @attr('string') declare name: string;
  @attr('string') declare releaseStatus: string;
  @attr('string') declare sampleExtensionIdeaTitle: string;
  @attr('string') declare sampleExtensionIdeaDescription: string;
  @attr('string') declare shortDescription: string;
  @attr('string') declare shortName: string;
  @attr('string') declare slug: string;
  @attr('string') declare testerRepositoryFullName: string;
  @attr() declare testimonials: { [key: string]: string }; // free-form JSON

  @hasMany('buildpack', { async: false, inverse: 'course' }) declare buildpacks: BuildpackModel[];
  @hasMany('course-definition-update', { async: false, inverse: 'course' }) declare definitionUpdates: CourseDefinitionUpdateModel[];
  @hasMany('course-extension-idea', { async: false, inverse: 'course' }) declare extensionIdeas: CourseExtensionIdeaModel[];
  @hasMany('course-extension', { async: false, inverse: 'course' }) declare extensions: CourseExtensionModel[];
  @hasMany('course-language-configuration', { async: false, inverse: 'course' }) declare languageConfigurations: CourseLanguageConfigurationModel[];
  @hasMany('course-stage', { async: false, inverse: 'course' }) declare stages: CourseStageModel[];
  @hasMany('course-tester-version', { async: false, inverse: 'course' }) declare testerVersions: CourseTesterVersionModel[];

  @equal('difficulty', 'easy') declare difficultyIsEasy: boolean;
  @equal('difficulty', 'hard') declare difficultyIsHard: boolean;
  @equal('difficulty', 'medium') declare difficultyIsMedium: boolean;

  @equal('slug', 'docker') declare isDocker: boolean;
  @equal('slug', 'git') declare isGit: boolean;
  @equal('slug', 'grep') declare isGrep: boolean;
  @equal('slug', 'react') declare isReact: boolean;
  @equal('slug', 'redis') declare isRedis: boolean;
  @equal('slug', 'sqlite') declare isSQLite: boolean;
  @equal('slug', 'bittorrent') declare isBittorrent: boolean;
  @equal('slug', 'dns-server') declare isDnsServer: boolean;
  @equal('slug', 'http-server') declare isHttpServer: boolean;

  @equal('releaseStatus', 'alpha') declare releaseStatusIsAlpha: boolean;
  @equal('releaseStatus', 'beta') declare releaseStatusIsBeta: boolean;
  @equal('releaseStatus', 'live') declare releaseStatusIsLive: boolean;

  @service declare date: DateService;

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

  get isFree() {
    return this.isFreeUntil && this.isFreeUntil > new Date(this.date.now());
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
        'http-server': 3,
        'dns-server': 4,
        bittorrent: 5,
        docker: 7,
        git: 1,
        grep: 6,
        redis: 2,
        sqlite: 8,
      }[this.slug] || 9
    );
  }

  // TODO[Extensions]: Should we include stages from extensions?
  get sortedBaseStages() {
    return this.baseStages.sortBy('position');
  }

  get sortedExtensionStages() {
    return this.sortedExtensions.mapBy('sortedStages').flat();
  }

  get sortedExtensions() {
    return this.extensions.sortBy('name');
  }

  get testerRepositoryLink() {
    return `https://github.com/${this.testerRepositoryFullName}`;
  }

  availableLanguageConfigurationsForUser(user: UserModel) {
    return this.languageConfigurations.filter((languageConfiguration) => languageConfiguration.isAvailableForUser(user));
  }

  trackIntroductionMarkdownFor(language: LanguageModel) {
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
    } else if (this.isBittorrent) {
      return `
Learn about .torrent files and the famous BitTorrent protocol. Implement your own BitTorrent client in ${language.name}.`;
    } else {
      return this.descriptionMarkdown;
    }
  }

  declare syncBuildpacks: (this: Model, payload: unknown) => Promise<SyncBuildpacksResponse>;
  declare syncCourseDefinitionUpdates: (this: Model, payload: unknown) => Promise<void>;
  declare syncCourseTesterVersions: (this: Model, payload: unknown) => Promise<void>;
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
