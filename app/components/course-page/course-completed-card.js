import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';

export default class CourseCompletedCardComponent extends Component {
  congratulationsImage = congratulationsImage;

  @tracked configureGithubIntegrationModalIsOpen = false;
}
