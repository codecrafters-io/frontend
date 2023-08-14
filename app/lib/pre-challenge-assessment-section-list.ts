import { tracked } from '@glimmer/tracking';

export class Section {
  repository: unknown;

  constructor(repository: unknown) {
    this.repository = repository;
  }

  get descriptionWhenCollapsed(): string | null {
    throw new Error('Not implemented');
  }

  get isComplete(): boolean {
    throw new Error('Not implemented');
  }

  get isDisabled(): boolean {
    return false;
  }

  get title(): string {
    throw new Error('Not implemented');
  }

  get type():
    | 'SelectLanguageSection'
    | 'SelectLanguageProficiencyLevelSection'
    | 'SelectExpectedActivityFrequencySection'
    | 'SelectRemindersPreferenceSection' {
    throw new Error('Not implemented');
  }
}

export class SelectLanguageSection extends Section {
  get descriptionWhenCollapsed() {
    // @ts-ignore
    return this.repository.language ? `${this.repository.language.name}` : null;
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
  get descriptionWhenCollapsed() {
    // @ts-ignore
    return this.repository.languageProficiencyLevel ? `${this.repository.languageProficiencyLevelHumanized}` : null;
  }

  get isComplete() {
    // @ts-ignore
    return !!this.repository.languageProficiencyLevel;
  }

  get isDisabled() {
    return !new SelectLanguageSection(this.repository).isComplete;
  }

  get title() {
    return 'Language Proficiency';
  }

  get type() {
    return 'SelectLanguageProficiencyLevelSection' as 'SelectLanguageProficiencyLevelSection';
  }
}

export class SelectExpectedActivityFrequencySection extends Section {
  get descriptionWhenCollapsed() {
    // @ts-ignore
    return this.repository.expectedActivityFrequencyHumanized ? `${this.repository.expectedActivityFrequencyHumanized}` : null;
  }

  get isComplete() {
    // @ts-ignore
    return !!this.repository.expectedActivityFrequency;
  }

  get isDisabled() {
    return !new SelectLanguageSection(this.repository).isComplete;
  }

  get title() {
    return 'Practice Cadence';
  }

  get type() {
    return 'SelectExpectedActivityFrequencySection' as 'SelectExpectedActivityFrequencySection';
  }
}

export class SelectRemindersPreferenceSection extends Section {
  get descriptionWhenCollapsed() {
    // @ts-ignore
    return this.repository.remindersAreEnabled ? 'Yes please' : "I'll pass";
  }

  get isComplete() {
    // @ts-ignore
    return this.repository.remindersAreEnabled === true || this.repository.remindersAreEnabled === false;
  }

  get isDisabled() {
    return !new SelectLanguageSection(this.repository).isComplete;
  }

  get title() {
    return 'Accountability';
  }

  get type() {
    return 'SelectRemindersPreferenceSection' as 'SelectRemindersPreferenceSection';
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

  get isComplete(): boolean {
    return this.sections.every((section) => section.isComplete);
  }

  indexOf(section: Section): number {
    return this.sections.indexOf(section);
  }

  nextSectionFor(section: Section): Section | null {
    return this.sections[this.sections.indexOf(section) + 1] || null;
  }
}

export function buildSectionList(repository: unknown) {
  return new SectionList([
    new SelectLanguageSection(repository),
    new SelectLanguageProficiencyLevelSection(repository),
    new SelectExpectedActivityFrequencySection(repository),
    new SelectRemindersPreferenceSection(repository),
  ]);
}
