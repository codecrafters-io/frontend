import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';

export default class ViewModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) declare viewer?: UserModel;
  @attr('string') declare resourceId: string;
  @attr('string') declare resourceType: string;
  @attr({}) declare metadata: Record<string, unknown>;
}
