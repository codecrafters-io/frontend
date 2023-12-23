import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageComponent extends Component {
  @service router;

  @tracked requestedLanguage = this.router.currentRoute.queryParams.languages;
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.sortBy('createdAt').lastObject;
  }

  get currentLanguage() {
    return this.args.filteredLanguages.firstObject || this.defaultLanguageDropdownSelection;
  }

  get defaultLanguageDropdownSelection() {
    return { name: 'All Languages', slug: 'all' };
  }

  get filteringDescription() {
    if (this.args.filteredLanguages.firstObject) {
      return `Showing submissions in ${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `Showing submissions in all languages`;
    }
  }

  get filteringTitle() {
    if (this.args.filteredLanguages.firstObject) {
      return `${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `All Languages`;
    }
  }

  get sortedLanguagesForDropdown() {
    const languagesForDropdown = [this.defaultLanguageDropdownSelection, ...this.args.course.betaOrLiveLanguages];

    return languagesForDropdown.sortBy('name');
  }

  @action
  handleRequestedLanguageChange(language) {
    if (!language) {
      return;
    }

    if (language.slug === 'all') {
      this.router.transitionTo({ queryParams: { languages: [] } });
    } else {
      this.router.transitionTo({ queryParams: { languages: language.slug } });
    }
  }
}
