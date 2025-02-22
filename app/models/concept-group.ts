import Model, { belongsTo, attr, hasMany } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import ConceptModel from 'codecrafters-frontend/models/concept';

export default class ConceptGroupModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) author!: UserModel;
  @hasMany('concept', { async: false, inverse: null }) concepts!: ConceptModel[];

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
