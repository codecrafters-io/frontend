import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class LiveCallWidgetAdminComponent extends Component {
  @service declare authenticator: AuthenticatorService;
  @service declare liveCallWidget: LiveCallWidgetService;

  @tracked isExpanded = false;
  @tracked isLoading = false;
  @tracked isSaving = false;
  @tracked markSpokenStatus = '';
  @tracked markSpokenUsername = '';

  // Current form state
  @tracked avatarUrl = '';
  @tracked buttonText = '';
  @tracked ctaText = '';
  @tracked hostName = '';
  @tracked hostTitle = '';
  @tracked isActive = false;
  @tracked meetLink = '';

  // Loaded state (to detect changes)
  private loadedActive = false;
  private loadedAvatarUrl = '';
  private loadedButtonText = '';
  private loadedCtaText = '';
  private loadedHostName = '';
  private loadedHostTitle = '';
  private loadedMeetLink = '';

  get hasAnyChanges(): boolean {
    return this.hasToggleChanged || this.hasFieldsChanged;
  }

  get hasFieldsChanged(): boolean {
    return (
      this.avatarUrl !== this.loadedAvatarUrl ||
      this.buttonText !== this.loadedButtonText ||
      this.ctaText !== this.loadedCtaText ||
      this.hostName !== this.loadedHostName ||
      this.hostTitle !== this.loadedHostTitle ||
      this.meetLink !== this.loadedMeetLink
    );
  }

  get hasToggleChanged(): boolean {
    return this.isActive !== this.loadedActive;
  }

  get saveButtonText(): string {
    if (this.isSaving) return 'Saving...';
    if (this.hasToggleChanged && this.isActive) return 'Go Live';
    if (this.hasToggleChanged && !this.isActive) return 'Switch Off';
    if (this.hasFieldsChanged) return 'Save Changes';

    return 'Save Changes';
  }

  @action
  async loadConfig(): Promise<void> {
    this.isLoading = true;

    try {
      const attrs = (await this.liveCallWidget.fetchConfig()) as Record<string, string | boolean>;
      this.isActive = (attrs['is-active'] as boolean) ?? false;
      this.avatarUrl = (attrs['avatar-url'] as string) ?? '';
      this.buttonText = (attrs['button-text'] as string) ?? '';
      this.ctaText = (attrs['cta-text'] as string) ?? '';
      this.hostName = (attrs['host-name'] as string) ?? '';
      this.hostTitle = (attrs['host-title'] as string) ?? '';
      this.meetLink = (attrs['meet-link'] as string) ?? '';

      // Snapshot loaded state
      this.loadedActive = this.isActive;
      this.loadedAvatarUrl = this.avatarUrl;
      this.loadedButtonText = this.buttonText;
      this.loadedCtaText = this.ctaText;
      this.loadedHostName = this.hostName;
      this.loadedHostTitle = this.hostTitle;
      this.loadedMeetLink = this.meetLink;
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
      const attrs: Record<string, unknown> = {};

      if (this.hasToggleChanged) {
        attrs['is-active'] = this.isActive;
      }

      if (this.hasFieldsChanged) {
        attrs['avatar-url'] = this.avatarUrl;
        attrs['button-text'] = this.buttonText;
        attrs['cta-text'] = this.ctaText;
        attrs['host-name'] = this.hostName;
        attrs['host-title'] = this.hostTitle;
        attrs['meet-link'] = this.meetLink;
      }

      await this.liveCallWidget.updateConfig(attrs);

      // Update snapshot to reflect saved state
      this.loadedActive = this.isActive;
      this.loadedAvatarUrl = this.avatarUrl;
      this.loadedButtonText = this.buttonText;
      this.loadedCtaText = this.ctaText;
      this.loadedHostName = this.hostName;
      this.loadedHostTitle = this.hostTitle;
      this.loadedMeetLink = this.meetLink;

      // Collapse after save so staff can see the result
      this.isExpanded = false;
    } catch (e) {
      console.error('Failed to save live call widget config:', e);
    } finally {
      this.isSaving = false;
    }
  }

  @action
  toggleActive(): void {
    this.isActive = !this.isActive;
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
