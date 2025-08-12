import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    author: UserModel;
  };

  Blocks: {
    default: [];
  };
}

export default class CommentTimelineItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CommentTimelineItem': typeof CommentTimelineItem;
  }
}
