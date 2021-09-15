import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageStepListCollapsedItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  @action
  handleClick() {
    console.log('clicked');
  }
}
