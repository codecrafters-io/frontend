import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';

import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';

type SectionDescription = {
  type: 'string',
  markdown: 'string'
}

type SectionProperties = {
  code: 'string',
  link: 'string',
  type: 'string',
  file_path: 'string',
  language_slug: 'string',
  highlighted_lines: 'string'
}

type Section = SectionDescription | SectionProperties;

export default class CodeWalkthrough extends Model {
  @attr('string')
  declare conclusionMarkdown: string;
  @attr('string')
  declare descriptionMarkdown: string;
  @attr('string')
  declare hackerNewsUrl: string;
  @attr('string')
  declare introductionMarkdown: string;
  @attr() 
  declare sections: Array<Section>; // free-form JSON
  @attr('string') 
  declare slug: string;
  @attr('string')
  declare title: string;
  @attr('date')
  declare updatedAt: Date;

  get introductionHTML(): SafeString | null {
    if (this.introductionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.introductionMarkdown));
    } else {
      return null;
    }
  }

  get conclusionHTML(): SafeString | null {
    if (this.conclusionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.conclusionMarkdown));
    } else {
      return null;
    }
  }

  get logoURL(): string {
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
