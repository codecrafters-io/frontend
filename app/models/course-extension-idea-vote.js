import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseExtensionIdeaVoteModel extends Model {
  @attr('date') createdAt;

  @belongsTo('course-extension-idea', { async: false, inverse: 'currentUserVotes' }) courseExtensionIdea;
  @belongsTo('user', { async: false, inverse: 'courseExtensionIdeaVotes' }) user;
}
