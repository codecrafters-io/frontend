import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseExtensionIdeaVoteModel extends Model {
  @attr('date') declare createdAt: Date;

  @belongsTo('course-extension-idea', { async: false, inverse: 'currentUserVotes' }) declare courseExtensionIdea: CourseExtensionIdeaModel;
  @belongsTo('user', { async: false, inverse: 'courseExtensionIdeaVotes' }) declare user: UserModel;
}
