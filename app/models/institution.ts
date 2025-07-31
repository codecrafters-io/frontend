import Model, { attr } from '@ember-data/model';

export default class InstitutionModel extends Model {
  @attr('string') declare logoUrl: string;
  @attr('string') declare longName: string;
  @attr('string') declare shortName: string;
  @attr('string') declare slug: string;
}
