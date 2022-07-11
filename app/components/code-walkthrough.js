import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import Prism from 'prismjs';
import showdown from 'showdown';

class ProseSection {
  type = 'ProseSection';

  constructor(markdown) {
    this.markdown = markdown;
  }

  get HTML() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.markdown));
  }
}

class ReferencedCodeSection {
  type = 'ReferencedCodeSection';

  constructor(code, languageSlug, link, filePath) {
    this.code = code;
    this.languageSlug = languageSlug;
    this.link = link;
    this.filePath = filePath;
  }
}

export default class CodeWalkthroughComponent extends Component {
  @action
  handleDidInsertProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }

  get sections() {
    return this.args.model.sections.map((section) => {
      if (section.type === 'prose') {
        return new ProseSection(section.markdown);
      } else if (section.type === 'referenced_code') {
        return new ReferencedCodeSection(section.code, section.language_slug, section.link, section.file_path);
      }
    });
  }
}
