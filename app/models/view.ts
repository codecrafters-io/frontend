import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import type { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class ViewModel extends Model {
  @belongsTo('user', { async: false }) declare viewer?: TemporaryUserModel;
  @attr('string') declare resourceId: string;
  @attr('string') declare resourceType: string;
}
