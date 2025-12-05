import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import type MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    membershipGift: MembershipGiftModel;
    managementToken?: string;
    isEditable?: boolean;
  };
}

export default class RedeemGiftPageGiftMessage extends Component<Signature> {
  fade = fade;

  @tracked isEditing = false;
  @tracked messageElement: HTMLElement | null = null;

  get shouldShowMessage(): boolean {
    return !!(this.args.membershipGift.senderMessage || this.isEditing);
  }

  @action
  handleCancelClick() {
    if (this.messageElement) {
      this.messageElement.innerText = this.args.membershipGift.senderMessage || '';
    }

    this.isEditing = false;
  }

  @action
  handleEditClick() {
    this.isEditing = true;

    // Wait for next tick to ensure contenteditable attribute is set
    next(() => {
      if (this.messageElement) {
        this.placeCursorAtEnd(this.messageElement);
      }
    });
  }

  @action
  handleMessageDidInsert(element: HTMLElement) {
    this.messageElement = element;
  }

  @action
  handleSaveClick() {
    if (!this.messageElement) {
      throw new Error('Message element not found');
    }

    // Ensure content-editable is set to false before ember updates the node's text content
    const newMessage = (this.messageElement!.innerText || '').trim();
    this.args.membershipGift.senderMessage = newMessage;
    this.updateMembershipGiftTask.perform();
    this.isEditing = false;

    next(() => {
      this.messageElement!.innerText = newMessage; // Ensure Ember doesn't conflict with contentEditable
    });
  }

  updateMembershipGiftTask = task({ keepLatest: true }, async (): Promise<void> => {
    if (!this.args.managementToken) {
      throw new Error('managementToken is required for saving');
    }

    await this.args.membershipGift.save({ adapterOptions: { managementToken: this.args.managementToken } });
  });

  private placeCursorAtEnd(element: HTMLElement) {
    element.focus();
    const range = document.createRange();
    const selection = window.getSelection();

    if (selection) {
      // Select all contents and collapse to the end
      range.selectNodeContents(element);
      range.collapse(false); // false means collapse to end
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RedeemGiftPage::GiftMessage': typeof RedeemGiftPageGiftMessage;
  }
}
