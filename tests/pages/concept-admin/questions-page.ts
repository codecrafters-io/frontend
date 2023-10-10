import { waitUntil } from '@ember/test-helpers';
import { collection, create, text, visitable } from 'ember-cli-page-object';

export default create({
  async clickOnQuestionCard(slug: string) {
    await waitUntil(() => this.questionCards.length > 0); // Ensure skeleton UI is gone
    await this.questionCards.toArray().findBy('slug', slug)!.click();
  },

  questionCards: collection('[data-test-question-card]', {
    slug: text('[data-test-question-slug]'),
  }),
  visit: visitable('/concepts/:concept_slug/admin/questions'),
});
