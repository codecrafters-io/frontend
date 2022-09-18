import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default class CourseIdeaModel extends Model {
  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('boolean') isArchived;
  @attr('string') name;
  @attr('string') slug;

  @hasMany('course-idea-vote', { async: false }) votes;
  @hasMany('course-idea-supervote', { async: false }) supervotes;

  @service('current-user') currentUserService;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  after() {
    run(() => {
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
    });
  },
});
