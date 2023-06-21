import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class CourseIdeaModel extends Model {
  @hasMany('course-idea-vote', { async: false }) currentUserVotes;
  @hasMany('course-idea-supervote', { async: false }) currentUserSupervotes;

  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('string') developmentStatus;
  @attr('boolean') isArchived;
  @attr('string') name;
  @attr('string') slug;
  @attr('number') votesCount;
  @attr('number') supervotesCount;

  @equal('developmentStatus', 'not_started') developmentStatusIsNotStarted;
  @equal('developmentStatus', 'in_progress') developmentStatusIsInProgress;
  @equal('developmentStatus', 'released') developmentStatusIsReleased;

  @service authenticator;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get isNewlyCreated() {
    return this.createdAt > new Date(Date.now() - 30 * 60 * 60 * 24) || this.votesCount < 20;
  }

  get reverseSortPositionForCourseIdeasPage() {
    let reverseSortPositionFromDevelopmentStatus = {
      not_started: 3,
      in_progress: 2,
      released: 1,
    }[this.developmentStatus];

    return `${reverseSortPositionFromDevelopmentStatus}-${this.createdAt.toISOString()}`;
  }

  supervote() {
    this.supervotesCount += 1;

    let supervote = this.store.createRecord('course-idea-supervote', { courseIdea: this, user: this.authenticator.currentUser });
    this.currentUserSupervotes.addObject(supervote);

    return supervote.save();
  }

  vote() {
    this.votesCount += 1;

    let vote = this.store.createRecord('course-idea-vote', { courseIdea: this, user: this.authenticator.currentUser });
    this.currentUserVotes.addObject(vote);

    return vote.save();
  }
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    this.currentUserSupervotes.toArray().forEach((record) => {
      this.supervotesCount -= 1;
      record.unloadRecord();
    });

    this.currentUserVotes.toArray().forEach((record) => {
      this.votesCount -= 1;
      record.unloadRecord();
    });
  },
});
