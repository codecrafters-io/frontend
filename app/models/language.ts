import CourseLanguageConfigurationModel from './course-language-configuration';
import Model from '@ember-data/model';
import { attr, hasMany } from '@ember-data/model';

import grayLogoC from '/assets/images/language-logos/c-gray-500.svg';
import grayLogoCpp from '/assets/images/language-logos/cpp-gray-500.svg';
import grayLogoClojure from '/assets/images/language-logos/clojure-gray-500.svg';
import grayLogoCrystal from '/assets/images/language-logos/crystal-gray-500.svg';
import grayLogoCsharp from '/assets/images/language-logos/csharp-gray-500.svg';
import grayLogoElixir from '/assets/images/language-logos/elixir-gray-500.svg';
import grayLogoGo from '/assets/images/language-logos/go-gray-500.svg';
import grayLogoHaskell from '/assets/images/language-logos/haskell-gray-500.svg';
import grayLogoJava from '/assets/images/language-logos/java-gray-500.svg';
import grayLogoJavascript from '/assets/images/language-logos/javascript-gray-500.svg';
import grayLogoKotlin from '/assets/images/language-logos/kotlin-gray-500.svg';
import grayLogoNim from '/assets/images/language-logos/nim-gray-500.svg';
import grayLogoPhp from '/assets/images/language-logos/php-gray-500.svg';
import grayLogoPython from '/assets/images/language-logos/python-gray-500.svg';
import grayLogoRuby from '/assets/images/language-logos/ruby-gray-500.svg';
import grayLogoRust from '/assets/images/language-logos/rust-gray-500.svg';
import grayLogoSwift from '/assets/images/language-logos/swift-gray-500.svg';

import tealLogoC from '/assets/images/language-logos/c-teal-500.svg';
import tealLogoCpp from '/assets/images/language-logos/cpp-teal-500.svg';
import tealLogoClojure from '/assets/images/language-logos/clojure-teal-500.svg';
import tealLogoCrystal from '/assets/images/language-logos/crystal-teal-500.svg';
import tealLogoCsharp from '/assets/images/language-logos/csharp-teal-500.svg';
import tealLogoElixir from '/assets/images/language-logos/elixir-teal-500.svg';
import tealLogoGo from '/assets/images/language-logos/go-teal-500.svg';
import tealLogoHaskell from '/assets/images/language-logos/haskell-teal-500.svg';
import tealLogoJava from '/assets/images/language-logos/java-teal-500.svg';
import tealLogoJavascript from '/assets/images/language-logos/javascript-teal-500.svg';
import tealLogoKotlin from '/assets/images/language-logos/kotlin-teal-500.svg';
import tealLogoNim from '/assets/images/language-logos/nim-teal-500.svg';
import tealLogoPhp from '/assets/images/language-logos/php-teal-500.svg';
import tealLogoPython from '/assets/images/language-logos/python-teal-500.svg';
import tealLogoRuby from '/assets/images/language-logos/ruby-teal-500.svg';
import tealLogoRust from '/assets/images/language-logos/rust-teal-500.svg';
import tealLogoSwift from '/assets/images/language-logos/swift-teal-500.svg';

export default class LanguageModel extends Model {
  @hasMany('course-language-configuration', { async: false }) declare courseConfigurations: CourseLanguageConfigurationModel[];

  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('string') declare trackStatus: string;

  get grayLogoUrl() {
    return {
      c: grayLogoC,
      cpp: grayLogoCpp,
      clojure: grayLogoClojure,
      crystal: grayLogoCrystal,
      csharp: grayLogoCsharp,
      elixir: grayLogoElixir,
      go: grayLogoGo,
      haskell: grayLogoHaskell,
      java: grayLogoJava,
      javascript: grayLogoJavascript,
      kotlin: grayLogoKotlin,
      nim: grayLogoNim,
      php: grayLogoPhp,
      python: grayLogoPython,
      ruby: grayLogoRuby,
      rust: grayLogoRust,
      swift: grayLogoSwift,
    }[this.slug];
  }

  get isGo() {
    return this.slug === 'go';
  }

  get sortPositionForTrack() {
    return (
      {
        go: 1,
        rust: 2,
        python: 3,
      }[this.slug] || 100 - this.stagesCount
    );
  }

  get stagesCount() {
    return this.store
      .peekAll('course')
      .filter((course) => course.betaOrLiveLanguages.includes(this))
      .map((course) => course.stages.length)
      .reduce((a, b) => a + b, 0);
  }

  get tealLogoUrl() {
    return {
      c: tealLogoC,
      cpp: tealLogoCpp,
      clojure: tealLogoClojure,
      crystal: tealLogoCrystal,
      csharp: tealLogoCsharp,
      elixir: tealLogoElixir,
      go: tealLogoGo,
      haskell: tealLogoHaskell,
      java: tealLogoJava,
      javascript: tealLogoJavascript,
      kotlin: tealLogoKotlin,
      nim: tealLogoNim,
      php: tealLogoPhp,
      python: tealLogoPython,
      ruby: tealLogoRuby,
      rust: tealLogoRust,
      swift: tealLogoSwift,
    }[this.slug];
  }

  get trackDescriptionMarkdown() {
    if (this.isGo) {
      return `
Achieve mastery in advanced Go, by building real-world projects. Featuring goroutines, systems programming,
file I/O, and more.
     `;
    } else {
      return `
${this.name} mastery exercises. Become your team's resident ${this.name} expert.
      `;
    }
  }

  get trackIntroductionMarkdown() {
    if (this.isGo) {
      return `
A quick welcome to CodeCrafters.
    `;
    } else {
      return `
A quick welcome to CodeCrafters.
    `;
    }
  }

  get trackIntroductionVideoId() {
    if (this.isGo) {
      return '717251339';
    } else {
      return '717263263';
    }
  }

  get trackTitle() {
    return `Master ${this.name}.`;
  }
}
