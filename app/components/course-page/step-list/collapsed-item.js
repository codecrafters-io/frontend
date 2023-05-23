import Component from '@glimmer/component';
import activeStepImage from '/assets/images/icons/live.svg';
import completedStepImage from '/assets/images/icons/tick3.png';
import futureStepImage from '/assets/images/icons/lock4.svg';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class CoursePageStepListCollapsedItemComponent extends Component {
  activeStepImage = activeStepImage;
  completedStepImage = completedStepImage;
  futureStepImage = futureStepImage;
}
