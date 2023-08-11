import { tracked } from '@glimmer/tracking';

export class Section {
  get collapsedTitle(): string {
    throw new Error('Not implemented');
  }

  get isComplete(): boolean {
    throw new Error('Not implemented');
  }

  get title(): string {
    throw new Error('Not implemented');
  }

  get type():
    | 'SelectLanguageSection'
    | 'SelectLanguageProficiencyLevelSection'
    | 'SelectActivityFrequencySection'
    | 'SelectRemindersPreferenceSection' {
    throw new Error('Not implemented');
  }
}

export class SelectLanguageSection extends Section {
  repository: unknown;

  constructor(repository: unknown) {
    super();

    this.repository = repository;
  }

  get collapsedTitle() {
    return 'Preferred Language';
  }

  get isComplete() {
    // @ts-ignore
    return !!this.repository.language;
  }

  get title() {
    return 'Preferred Language';
  }

  get type() {
    return 'SelectLanguageSection' as 'SelectLanguageSection';
  }
}

export class SelectLanguageProficiencyLevelSection extends Section {
  repository: unknown;

  constructor(repository: unknown) {
    super();

    this.repository = repository;
  }

  get collapsedTitle() {
    return 'Language Proficiency';
  }

  get isComplete() {
    // @ts-ignore
    return !!this.repository.language;
  }

  get title() {
    return 'Language Proficiency';
  }

  get type() {
    return 'SelectLanguageProficiencyLevelSection' as 'SelectLanguageProficiencyLevelSection';
  }
}

export class SectionList {
  @tracked sections: Section[];

  constructor(sections: Section[]) {
    this.sections = sections;
  }

  get activeSection(): Section {
    return this.sections.find((section) => !section.isComplete) || (this.sections[this.sections.length - 1] as Section);
  }

  indexOf(section: Section): number {
    return this.sections.indexOf(section);
  }

  nextSectionFor(section: Section): Section | null {
    return this.sections[this.sections.indexOf(section) + 1] || null;
  }
}

export function buildSectionList(repository: unknown) {
  return new SectionList([new SelectLanguageSection(repository), new SelectLanguageProficiencyLevelSection(repository)]);
}
