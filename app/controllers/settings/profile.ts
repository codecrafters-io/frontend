import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { ModelType } from 'codecrafters-frontend/routes/settings';
import { task, timeout } from 'ember-concurrency';

export default class ProfileController extends Controller {
  declare model: ModelType;

  @tracked isUpdatingProfileDescriptionMarkdown = false;
  @tracked profileDescriptionMarkdownWasUpdatedRecently = false;

  @action
  async handleProfileDescriptionMarkdownUpdated() {
    this.updateProfileDescriptionMarkdown.perform();
  }

  updateProfileDescriptionMarkdown = task({ keepLatest: true }, async (): Promise<void> => {
    this.isUpdatingProfileDescriptionMarkdown = true;
    this.profileDescriptionMarkdownWasUpdatedRecently = false;

    try {
      await this.model.user.save();
    } catch (e) {
      console.error(e);

      // TODO: Handle error state?

      return;
    }

    this.isUpdatingProfileDescriptionMarkdown = false;
    this.profileDescriptionMarkdownWasUpdatedRecently = true;
    await timeout(1000);
    this.profileDescriptionMarkdownWasUpdatedRecently = false;
  });
}
