import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageRepositoryDropdownComponent extends Component {
  @service router;

  @action
  async handleRepositoryLinkClick(repository, dropdownActions) {
    await this.router.transitionTo('course', repository.course.get('slug'), { queryParams: { repo: repository.id } });
    dropdownActions.close();
  }

  @action
  async handleTryDifferentLanguageActionClick(dropdownActions) {
    await this.router.transitionTo({ queryParams: { fresh: true, repo: null } });
    dropdownActions.close();
  }

  get nonActiveRepositories() {
    return this.args.repositories.reject((repository) => repository === this.args.activeRepository);
  }
}
