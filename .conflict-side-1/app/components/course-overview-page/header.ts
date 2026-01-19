import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    language?: LanguageModel;
  };

  Blocks: {
    cta?: [];
  };
}

export default class CourseOverviewPageHeader extends Component<Signature> {
  get orderedSupportedLanguages(): LanguageModel[] {
    return this.args.course.betaOrLiveLanguages.sort((a, b) => {
      if (a.slug === this.args.language?.slug) {
        return -1;
      }

      if (b.slug === this.args.language?.slug) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Header': typeof CourseOverviewPageHeader;
  }
}
