import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class RequestLanguageButtonComponent extends Component {
  @service store;

  @action
  handleDidInsert() {
    this.store.findAll('course-language-request', { include: 'course,user,language' });
    this.store.findAll('language');
  }
}
