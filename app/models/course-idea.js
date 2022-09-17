import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import deleteFromEmberStore from '../lib/delete-from-ember-store';

export default class CourseIdeaModel extends Model {
  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('boolean') isArchived;
  @attr('string') name;
  @attr('string') slug;

  @hasMany('course-idea-vote') votes;
  @hasMany('course-idea-supervote') supervotes;

  @service('current-user') currentUserService;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }
}

CourseIdeaModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  after() {
    // Note: courseIdea.id is required here since courseIdea is a Proxy object
    this.currentUserService.record.courseIdeaVotes.filterBy('courseIdea.id', this.id).forEach((record) => deleteFromEmberStore(this.store, record));

    this.currentUserService.record.courseIdeaSupervotes
      .filterBy('courseIdea.id', this.id)
      .forEach((record) => deleteFromEmberStore(this.store, record));
  },
});
