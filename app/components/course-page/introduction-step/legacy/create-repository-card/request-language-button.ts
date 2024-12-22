import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import Store from '@ember-data/store';
import UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    course: CourseModel;
    user: UserModel;
  };
}

export default class RequestLanguageButtonComponent extends Component<Signature> {
  @service declare store: Store;

  @action
  handleDidInsert() {
    this.store.findAll('course-language-request', { include: 'course,user,language' });
    this.store.findAll('language');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::Legacy::CreateRepositoryCard::RequestLanguageButton': typeof RequestLanguageButtonComponent;
  }
}
