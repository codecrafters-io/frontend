import Model, { attr } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class PerkModel extends Model {
  @attr('string') declare slug: string;

  declare claim: (this: Model, payload: unknown) => Promise<void>;
}

PerkModel.prototype.claim = memberAction({
  path: 'claim',
  type: 'post',

  after(response) {
    return response;
  },
});
