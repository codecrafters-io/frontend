import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class LiveCallWidgetAdminComponent extends Component {
  @service declare liveCallWidget: LiveCallWidgetService;
  @service declare authenticator: AuthenticatorService;

  @tracked isExpanded = false;
  @tracked isLoading = false;
  @tracked isSaving = false;
  @tracked markSpokenUsername = '';
  @tracked markSpokenStatus = '';

  @tracked isActive = false;
  @tracked meetLink = '';
  @tracked hostName = '';
  @tracked hostTitle = '';
  @tracked avatarUrl = '';
  @tracked ctaText = '';
  @tracked buttonText = '';

  @action
  async loadConfig(): Promise<void> {
    this.isLoading = true;

    try {
      const attrs = await this.liveCallWidget.fetchConfig() as Record<string, string | boolean>;
      this.isActive = attrs['is-active'] as boolean ?? false;
      this.meetLink = (attrs['meet-link'] as string) ?? '';
      this.hostName = (attrs['host-name'] as string) ?? '';
      this.hostTitle = (attrs['host-title'] as string) ?? '';
      this.avatarUrl = (attrs['avatar-url'] as string) ?? '';
      this.ctaText = (attrs['cta-text'] as string) ?? '';
      this.buttonText = (attrs['button-text'] as string) ?? '';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async markUserSpoken(): Promise<void> {
    if (!this.markSpokenUsername.trim()) return;

    const result = await this.liveCallWidget.markUserSpoken(this.markSpokenUsername.trim());

    if (result.success) {
      this.markSpokenStatus = `Marked ${this.markSpokenUsername} as spoken to`;
      this.markSpokenUsername = '';
    } else {
      this.markSpokenStatus = result.error ?? 'Error';
    }

    setTimeout(() => {
      this.markSpokenStatus = '';
    }, 3000);
  }

  @action
  async saveConfig(): Promise<void> {
    this.isSaving = true;

    try {
      await this.liveCallWidget.updateConfig({
        'meet-link': this.meetLink,
        'host-name': this.hostName,
        'host-title': this.hostTitle,
        'avatar-url': this.avatarUrl,
        'cta-text': this.ctaText,
        'button-text': this.buttonText,
      });
    } finally {
      this.isSaving = false;
    }
  }

  @action
  async toggleActive(): Promise<void> {
    const newValue = !this.isActive;
    this.isActive = newValue;

    await this.liveCallWidget.updateConfig({ 'is-active': newValue });
  }

  @action
  async toggleExpanded(): Promise<void> {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded && !this.isLoading) {
      await this.loadConfig();
    }
  }

  @action
  updateField(field: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    (this as Record<string, unknown>)[field] = target.value;
  }
}
