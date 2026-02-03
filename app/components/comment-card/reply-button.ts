import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;
}

export default class ReplyButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CommentCard::ReplyButton': typeof ReplyButton;
  }
}
