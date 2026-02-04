import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class CoursePageConfigureGithubIntegrationModalStep extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureGithubIntegrationModal::Step': typeof CoursePageConfigureGithubIntegrationModalStep;
  }
}
