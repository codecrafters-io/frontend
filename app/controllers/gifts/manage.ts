import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/manage';

export default class GiftsManageController extends Controller {
  declare model: ModelType;

  @tracked isEditing = false;
  @tracked messageElement: HTMLElement | null = null;

  @action
  handleCancelClick() {
    this.messageElement!.textContent = this.model.senderMessage;
    this.isEditing = false;
  }

  @action
  handleCopyButtonClick() {
    // Handler for copy button click
  }

  @action
  handleEditClick() {
    this.isEditing = true;
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

    const newMessage = this.messageElement.textContent || '';
    this.model.senderMessage = newMessage;
    this.updateMembershipGiftTask.perform();
  }

  updateMembershipGiftTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.model.save();
  });
}
