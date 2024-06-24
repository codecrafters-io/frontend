import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { parse } from 'node-html-parser';
import Prism from 'prismjs';
import showdown from 'showdown';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-zig';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-dart';

class ProseSection {
  type = 'ProseSection';

  constructor(markdown) {
    this.markdown = markdown;
  }

  get HTML() {
    showdown.extension('formatted-github-links', {
      type: 'output',
      filter: (text /* , converter, options*/) => {
        const parsed = parse(text);
        const linkElements = parsed.querySelectorAll('a');

        const githubSvgHTML = parse(`<svg viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="inline w-4 mx-1">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" />
        </svg>`);

        linkElements.forEach((linkElement) => {
          if (linkElement.getAttribute('href').startsWith('https://github.com')) {
            linkElement.classList.add('whitespace-nowrap');
            linkElement.insertAdjacentHTML('afterbegin', githubSvgHTML);
          }
        });

        return parsed.toString();
      },
    });

    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true, extensions: ['formatted-github-links'] }).makeHtml(this.markdown));
  }
}

class ReferencedCodeSection {
  type = 'ReferencedCodeSection';

  constructor(code, languageSlug, link, filePath, highlightedLines) {
    this.code = code;
    this.languageSlug = languageSlug;
    this.highlightedLines = highlightedLines;
    this.link = link;
    this.filePath = filePath;
  }
}

export default class CodeWalkthroughComponent extends Component {
  get sections() {
    return this.args.model.sections.map((section) => {
      if (section.type === 'prose') {
        return new ProseSection(section.markdown);
      } else if (section.type === 'referenced_code') {
        return new ReferencedCodeSection(section.code, section.language_slug, section.link, section.file_path, section.highlighted_lines);
      }
    });
  }

  @action
  handleDidInsertProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }
}
