import Model from '@ember-data/model';
import { attr } from '@ember-data/model';
import redisLogo from '/assets/images/challenge-logos/challenge-logo-redis.svg';
import dockerLogo from '/assets/images/challenge-logos/challenge-logo-docker.svg';
import gitLogo from '/assets/images/challenge-logos/challenge-logo-git.svg';
import sqliteLogo from '/assets/images/challenge-logos/challenge-logo-sqlite.svg';
import grepLogo from '/assets/images/challenge-logos/challenge-logo-grep.svg';

type ProseSection = {
  markdown: 'string';
  type: 'string';
};

type ReferencedCodeSection = {
  code: 'string';
  file_path: 'string';
  highlighted_lines: 'string';
  language_slug: 'string';
  link: 'string';
  type: 'string';
};

type Section = ProseSection | ReferencedCodeSection;

export default class CodeWalkthrough extends Model {
  @attr('string') declare conclusionMarkdown: string;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare hackerNewsUrl: string;
  @attr('string') declare introductionMarkdown: string;
  @attr() declare sections: Array<Section>; // free-form JSON
  @attr('string') declare slug: string;
  @attr('string') declare title: string;
  @attr('date') declare updatedAt: Date;

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
