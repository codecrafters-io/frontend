import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

export default class CourseExtensionIdeaModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensionIdeas' }) course;

  @hasMany('course-extension-idea-vote', { async: false, inverse: 'courseExtensionIdea' }) currentUserVotes;

  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('string') developmentStatus;
  @attr('string') name;
  @attr('string') slug;
  @attr('number') votesCount;

  @equal('developmentStatus', 'not_started') developmentStatusIsNotStarted;
  @equal('developmentStatus', 'in_progress') developmentStatusIsInProgress;
  @equal('developmentStatus', 'released') developmentStatusIsReleased;

  @service authenticator;

  get isNewlyCreated() {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votesCount < 20;
  }

  async vote() {
    this.votesCount += 1;

    const vote = this.store.createRecord('course-extension-idea-vote', { courseExtensionIdea: this, user: this.authenticator.currentUser });

    await vote.save();

    return vote;
  }
}

CourseExtensionIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    for (const record of [...this.currentUserVotes]) {
      this.votesCount -= 1;
      record.unloadRecord();
    }
  },
});
