import { attr } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import Model from '@ember-data/model';
import showdown from 'showdown';

import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';
import reactLogo from '/assets/images/challenge-logos/challenge-logo-react.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';

export default class CodeWalkthrough extends Model {
  @attr('string') conclusionMarkdown;
  @attr('string') descriptionMarkdown;
  @attr('string') hackerNewsUrl;
  @attr('string') introductionMarkdown;
  @attr('') sections; // free-form JSON
  @attr('string') slug;
  @attr('string') title;
  @attr('date') updatedAt;

  get introductionHTML() {
    if (this.introductionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.introductionMarkdown));
    } else {
      return null;
    }
  }

  get conclusionHTML() {
    if (this.conclusionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.conclusionMarkdown));
    } else {
      return null;
    }
  }

  get logoURL() {
    if (this.slug.startsWith('redis')) {
      return redisLogo;
    } else if (this.slug.startsWith('git')) {
      return gitLogo;
    } else if (this.slug.startsWith('docker')) {
      return dockerLogo;
    } else if (this.slug.startsWith('sqlite')) {
      return sqliteLogo;
    } else if (this.slug.startsWith('grep')) {
      return grepLogo;
    } else {
      // Fallback
      return redisLogo;
    }
  }
}
