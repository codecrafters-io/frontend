import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class CourseExtensionIdeaModel extends Model {
  @belongsTo('course', { async: false }) course;
  @hasMany('course-extension-idea-vote', { async: false }) votes;
  @hasMany('course-extension-idea-supervote', { async: false }) supervotes;

  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('string') name;
  @attr('string') slug;

  @service('current-user') currentUserService;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get isNewlyCreated() {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votes.length < 20;
  }

  supervote() {
    return this.store.createRecord('course-extension-idea-supervote', { courseExtensionIdea: this, user: this.currentUserService.record }).save();
  }

  vote() {
    return this.store.createRecord('course-extension-idea-vote', { courseExtensionIdea: this, user: this.currentUserService.record }).save();
  }
}

CourseExtensionIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    let currentUser = this.currentUserService.record;

    currentUser.courseExtensionIdeaVotes.filterBy('courseExtensionIdea', this).forEach((record) => {
      record.courseExtensionIdea.votes.removeObject(record);
      record.user.courseExtensionIdeaVotes.removeObject(record);
      record.unloadRecord();
    });

    currentUser.courseExtensionIdeaSupervotes.filterBy('courseExtensionIdea', this).forEach((record) => {
      record.courseExtensionIdea.supervotes.removeObject(record);
      record.user.courseExtensionIdeaSupervotes.removeObject(record);
      record.unloadRecord();
    });
  },
});
