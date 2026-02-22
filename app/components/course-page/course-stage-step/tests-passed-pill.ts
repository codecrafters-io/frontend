import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;
}

export default class TestsPassedPill extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedPill': typeof TestsPassedPill;
  }
}
