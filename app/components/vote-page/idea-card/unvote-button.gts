import Component from '@glimmer/component';

type Signature = {
  Element: HTMLButtonElement;
};

export default class UnvoteButtonComponent extends Component<Signature> {
  <template>
    <button type='button' class='flex items-center text-gray-400 hover:text-gray-500 px-2 hover:underline' data-test-unvote-button ...attributes>
      <span class='text-xs'>
        Cancel
      </span>
    </button>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::IdeaCard::UnvoteButton': typeof UnvoteButtonComponent;
  }
}
