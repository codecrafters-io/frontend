import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onPublishToGithubButtonClick: () => void;
  };
}

export default class PublishToGithubPrompt extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageItem::PublishToGithubPrompt': typeof PublishToGithubPrompt;
  }
}
