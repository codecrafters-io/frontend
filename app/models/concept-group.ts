import Model, { belongsTo } from '@ember-data/model';
import { attr } from '@ember-data/model';
import { TemporaryUserModel } from './temporary-types';

export default class ConceptGroupModel extends Model {
  @belongsTo('user', { async: false }) author!: TemporaryUserModel;

  @attr() conceptSlugs!: Array<string>;
  @attr('string') descriptionMarkdown!: string;
  @attr('string') slug!: string;
  @attr('string') title!: string;

  nextConceptSlug(conceptSlug: string) {
    const currentSlugIndex = this.conceptSlugs.indexOf(conceptSlug);

    if (currentSlugIndex > this.conceptSlugs.length - 1) {
      return null;
    }

    return this.conceptSlugs[currentSlugIndex + 1];
  }
}
