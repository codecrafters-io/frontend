import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class CourseExtensionIdeaModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensionIdeas' }) course;

  @hasMany('course-extension-idea-vote', { async: false }) currentUserVotes;
  @hasMany('course-extension-idea-supervote', { async: false }) currentUserSupervotes;

  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('string') name;
  @attr('string') slug;
  @attr('number') votesCount;
  @attr('number') supervotesCount;

  @service authenticator;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get isNewlyCreated() {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votesCount < 20;
  }

  supervote() {
    this.supervotesCount += 1;

    let supervote = this.store.createRecord('course-extension-idea-supervote', { courseExtensionIdea: this, user: this.authenticator.currentUser });
    this.currentUserSupervotes.pushObject(supervote);

    return supervote.save();
  }

  vote() {
    this.votesCount += 1;

    let vote = this.store.createRecord('course-extension-idea-vote', { courseExtensionIdea: this, user: this.authenticator.currentUser });
    this.currentUserVotes.pushObject(vote);

    return vote.save();
  }
}

CourseExtensionIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    this.currentUserVotes.toArray().forEach((record) => {
      this.votesCount -= 1;
      record.unloadRecord();
    });

    this.currentUserSupervotes.toArray().forEach((record) => {
      this.supervotesCount -= 1;
      record.unloadRecord();
    });
  },
});
