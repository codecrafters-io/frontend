import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UpgradePromptComponent extends Component {
  @service('router') router;
  @service('current-user') currentUserService;
  @tracked isSaving = false;

  @action
  handleSubscribeLinkClicked() {
    this.router.transitionTo('pay');
  }

  @action
  async handleDisableEmailReminderButtonClicked() {
    this.freeUsageRestriction.expiryReminderIsEnabled = false;

    this.isSaving = true;
    await this.freeUsageRestriction.save();
    this.isSaving = false;
  }

  @action
  async handleEnableEmailReminderButtonClicked() {
    this.freeUsageRestriction.expiryReminderIsEnabled = true;

    this.isSaving = true;
    await this.freeUsageRestriction.save();
    this.isSaving = false;
  }

  get humanFriendlyFreeUsageRestrictionExpiresAt() {
    let currentTime = new Date();
    let timezoneOffset = -1 * currentTime.getTimezoneOffset();
    let formattedTimezoneOffset;

    if (timezoneOffset === 0) {
      formattedTimezoneOffset = 'GMT';
    } else if (timezoneOffset % 60 === 0) {
      formattedTimezoneOffset = `GMT${timezoneOffset > 0 ? '+' : '-'}${Math.abs(timezoneOffset) / 60}`;
    } else {
      formattedTimezoneOffset = `GMT${timezoneOffset > 0 ? '+' : '-'}${Math.floor(Math.abs(timezoneOffset) / 60)}:${Math.abs(timezoneOffset) % 60}`;
    }

    let dateIsToday = this.freeUsageRestrictionExpiresAt.toDateString() === currentTime.toDateString();
    let dateIsTomorrow = this.freeUsageRestrictionExpiresAt.toDateString() === new Date(currentTime.getTime() + 24 * 60 * 60 * 1000).toDateString();

    if (dateIsToday) {
      return htmlSafe(
        `<span class="font-semibold">today at ${this.freeUsageRestrictionExpiresAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}</span> (${formattedTimezoneOffset})`
      );
    } else if (dateIsTomorrow) {
      return htmlSafe(
        `<span class="font-semibold">tomorrow at ${this.freeUsageRestrictionExpiresAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}</span> (${formattedTimezoneOffset})`
      );
    } else {
      return `at ${this.freeUsageRestrictionExpiresAt.toLocaleTimeString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
  }

  get freeUsageRestriction() {
    return this.currentUserService.record.freeUsageRestriction;
  }

  get freeUsageRestrictionExpiresAt() {
    return this.freeUsageRestriction.expiresAt;
  }
}
