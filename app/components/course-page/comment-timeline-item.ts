import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    author: UserModel;
  };

  Blocks: {
    default: [];
  };
};

export default class CommentTimelineItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CommentTimelineItem': typeof CommentTimelineItemComponent;
  }
}
