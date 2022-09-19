import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class CourseIdeaModel extends Model {
  @hasMany('course-idea-vote', { async: false }) votes;
  @hasMany('course-idea-supervote', { async: false }) supervotes;

  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('string') developmentStatus;
  @attr('boolean') isArchived;
  @attr('string') name;
  @attr('string') slug;

  @equal('developmentStatus', 'not_started') developmentStatusIsNotStarted;
  @equal('developmentStatus', 'in_progress') developmentStatusIsInProgress;
  @equal('developmentStatus', 'in_progress') developmentStatusIsCompleted;

  @service('current-user') currentUserService;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get isNewlyCreated() {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votes.length < 20;
  }

  supervote() {
    return this.store.createRecord('course-idea-supervote', { courseIdea: this, user: this.currentUserService.record }).save();
  }

  vote() {
    return this.store.createRecord('course-idea-vote', { courseIdea: this, user: this.currentUserService.record }).save();
  }
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    let currentUser = this.currentUserService.record;

    currentUser.courseIdeaVotes.filterBy('courseIdea', this).forEach((record) => {
      record.courseIdea.votes.removeObject(record);
      record.user.courseIdeaVotes.removeObject(record);
      record.unloadRecord();
    });

    currentUser.courseIdeaSupervotes.filterBy('courseIdea', this).forEach((record) => {
      record.courseIdea.supervotes.removeObject(record);
      record.user.courseIdeaSupervotes.removeObject(record);
      record.unloadRecord();
    });
  },
});
