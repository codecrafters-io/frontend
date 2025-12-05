import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/manage';

export default class GiftsManageController extends Controller {
  declare model: ModelType;

  @tracked isEditing = false;
  @tracked messageElement: HTMLElement | null = null;

  @action
  handleCancelClick() {
    if (this.messageElement) {
      this.messageElement.innerText = this.model.senderMessage || '';
    }

    this.isEditing = false;
  }

  @action
  handleCopyButtonClick() {
    // Handler for copy button click
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

    this.isEditing = false;

    // Ensure content-editable is set to false before ember updates the node's text content
    const newMessage = (this.messageElement!.innerText || '').trim();
    this.model.senderMessage = newMessage;
    this.updateMembershipGiftTask.perform();

    next(() => {
      this.messageElement!.innerText = newMessage; // Ensure Ember doesn't conflict with contentEditable
    });
  }

  updateMembershipGiftTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.model.save();
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
