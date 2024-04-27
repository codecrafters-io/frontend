import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

import type UserModel from 'codecrafters-frontend/models/user'

export default class UpvoteModel extends Model {
  @attr('string') declare targetId: string;
  @attr('string') declare targetType: string;

  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;
}
