import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { htmlSafe } from '@ember/template';

export default class LanguageModel extends Model {
  @attr('string') name;
  @attr('string') slug;

  @equal('slug', 'c') isC;
  @equal('slug', 'csharp') isCsharp;
  @equal('slug', 'elixir') isElixir;
  @equal('slug', 'go') isGo;
  @equal('slug', 'haskell') isHaskell;
  @equal('slug', 'java') isJava;
  @equal('slug', 'javascript') isJavascript;
  @equal('slug', 'kotlin') isKotlin;
  @equal('slug', 'nim') isNim;
  @equal('slug', 'php') isPhp;
  @equal('slug', 'python') isPython;
  @equal('slug', 'ruby') isRuby;
  @equal('slug', 'rust') isRust;
  @equal('slug', 'swift') isSwift;

  get isGo() {
    return this.slug === 'go';
  }

  get grayLogoUrl() {
    return {
      c: '/assets/images/language-logos/c-gray-500.svg',
      clojure: '/assets/images/language-logos/clojure-gray-500.svg',
      crystal: '/assets/images/language-logos/crystal-gray-500.svg',
      csharp: '/assets/images/language-logos/csharp-gray-500.svg',
      elixir: '/assets/images/language-logos/elixir-gray-500.svg',
      go: '/assets/images/language-logos/go-gray-500.svg',
      haskell: '/assets/images/language-logos/haskell-gray-500.svg',
      java: '/assets/images/language-logos/java-gray-500.svg',
      javascript: '/assets/images/language-logos/javascript-gray-500.svg',
      kotlin: '/assets/images/language-logos/kotlin-gray-500.svg',
      nim: '/assets/images/language-logos/nim-gray-500.svg',
      php: '/assets/images/language-logos/php-gray-500.svg',
      python: '/assets/images/language-logos/python-gray-500.svg',
      ruby: '/assets/images/language-logos/ruby-gray-500.svg',
      rust: '/assets/images/language-logos/rust-gray-500.svg',
      swift: '/assets/images/language-logos/swift-gray-500.svg',
    }[this.slug];
  }

  get tealLogoUrl() {
    return {
      c: '/assets/images/language-logos/c-teal-500.svg',
      clojure: '/assets/images/language-logos/clojure-teal-500.svg',
      crystal: '/assets/images/language-logos/crystal-teal-500.svg',
      csharp: '/assets/images/language-logos/csharp-teal-500.svg',
      elixir: '/assets/images/language-logos/elixir-teal-500.svg',
      go: '/assets/images/language-logos/go-teal-500.svg',
      haskell: '/assets/images/language-logos/haskell-teal-500.svg',
      java: '/assets/images/language-logos/java-teal-500.svg',
      javascript: '/assets/images/language-logos/javascript-teal-500.svg',
      kotlin: '/assets/images/language-logos/kotlin-teal-500.svg',
      nim: '/assets/images/language-logos/nim-teal-500.svg',
      php: '/assets/images/language-logos/php-teal-500.svg',
      python: '/assets/images/language-logos/python-teal-500.svg',
      ruby: '/assets/images/language-logos/ruby-teal-500.svg',
      rust: '/assets/images/language-logos/rust-teal-500.svg',
      swift: '/assets/images/language-logos/swift-teal-500.svg',
    }[this.slug];
  }

  get trackDescriptionHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.trackDescriptionMarkdown));
  }

  get trackDescriptionMarkdown() {
    if (this.isGo) {
      return `
Go mastery exercises, featuring unique Go features and recommended patterns, including Goroutines, gRPC, and
Channel buffers. Become your team’s resident Go-expert.
     `;
    } else {
      return `
${this.name} mastery exercises. Become your team's resident ${this.name} expert.
      `;
    }
  }

  get trackIntroductionMarkdown() {
    return `
Experience Go by building 4 different devtools from scratch. The projects are hands-on and require dedication,
but the benefits are worth it. In this section, we will cover the CodeCrafters philosophy and the journey you will
go through.
    `;
  }
}
