import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class CliUsageInstructionsComponent extends Component<Signature> { }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CliUsageInstructions': typeof CliUsageInstructionsComponent;
  }
}
