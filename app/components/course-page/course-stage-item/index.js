import Component from '@glimmer/component';

// TODO: Legacy, to be removed
export default class CourseStageItem extends Component {
  get shouldShowPublishToGitHubPrompt() {
    return !this.args.repository.githubRepositorySyncConfiguration && this.isCurrentStage && !this.statusIsComplete && this.args.courseStage.isThird;
  }
}
