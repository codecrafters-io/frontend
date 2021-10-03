import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') name;
  @attr('string') slug;

  get grayLogoUrl() {
    return {
      c: '/assets/images/language-logos/c-gray-500.svg',
      clojure: '/assets/images/language-logos/clojure-gray-500.svg',
      crystal: '/assets/images/language-logos/crystal-gray-500.svg',
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
      crystal: '/assets/images/language-logos/crystal-teal-500.svg',
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
}
