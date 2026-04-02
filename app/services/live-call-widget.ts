import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';

export default class LiveCallWidgetService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare sessionTokenStorage: SessionTokenStorageService;

  @tracked isAvailable = false;
  @tracked displayData: {
    host_name: string;
    host_title: string;
    avatar_url: string;
    cta_text: string;
    button_text: string;
    meet_link: string;
  } | null = null;

  subscription: ActionCableSubscription | null = null;

  get shouldShowWidget(): boolean {
    if (!this.authenticator.isAuthenticated) return false;
    if (!this.authenticator.currentUser) return false;
    if (this.authenticator.currentUser.isStaff) return false;

    return this.isAvailable && this.displayData !== null;
  }

  get shouldShowAdminPanel(): boolean {
    if (!this.authenticator.isAuthenticated) return false;
    if (!this.authenticator.currentUser) return false;

    return this.authenticator.currentUser.isStaff;
  }

  subscribe(): void {
    if (this.subscription) return;

    this.subscription = this.actionCableConsumer.subscribe(
      'LiveCallWidgetChannel',
      {},
      {
        onData: (data: { type: string; available: boolean; display_data?: { host_name: string; host_title: string; avatar_url: string; cta_text: string; button_text: string; meet_link: string } }) => {
          if (data.type === 'status_change') {
            if (data.available && data.display_data) {
              this.displayData = data.display_data;
              this.isAvailable = true;
            } else {
              this.isAvailable = false;
              this.displayData = null;
            }
          }
        },
      },
    );
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  async fetchConfig(): Promise<Record<string, unknown>> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config`, {
      headers: this.adminHeaders(),
    });

    const json = await response.json();
    return json.data?.attributes ?? {};
  }

  async updateConfig(attributes: Record<string, unknown>): Promise<void> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config`, {
      method: 'PATCH',
      headers: {
        ...this.adminHeaders(),
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: { attributes },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.status}`);
    }
  }

  async markUserSpoken(username: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config/mark-user-spoken`, {
      method: 'POST',
      headers: {
        ...this.adminHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      return { success: true };
    } else if (response.status === 404) {
      return { success: false, error: 'User not found' };
    } else {
      return { success: false, error: 'Something went wrong' };
    }
  }

  private adminHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const token = this.sessionTokenStorage.currentToken;

    if (token) {
      headers['x-session-token'] = token;
    }

    return headers;
  }
}

declare module '@ember/service' {
  interface Registry {
    'live-call-widget': LiveCallWidgetService;
  }
}
