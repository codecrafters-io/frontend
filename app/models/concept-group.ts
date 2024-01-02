import Model, { belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import { attr } from '@ember-data/model';

export default class ConceptGroupModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) author!: UserModel;

  @attr() conceptSlugs!: Array<string>;
  @attr('string') descriptionMarkdown!: string;
  @attr('string') slug!: string;
  @attr('string') title!: string;

  nextConceptSlug(conceptSlug: string) {
    const currentSlugIndex = this.conceptSlugs.indexOf(conceptSlug);
    const nextSlugIndex = currentSlugIndex + 1;

    if (nextSlugIndex > this.conceptSlugs.length - 1) {
      return null;
    }

    return this.conceptSlugs[nextSlugIndex];
  }
}
