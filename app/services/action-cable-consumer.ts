import { createConsumer, logger } from '@rails/actioncable';
import { Consumer } from '@rails/actioncable';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from './authenticator';
import Service, { service } from '@ember/service';
import type SessionTokenStorageService from './session-token-storage';

// Toggle this for debug logs
logger.enabled = false;

export default class ActionCableConsumerService extends Service {
  _cachedConsumer: Consumer | null = null;

  @service declare authenticator: AuthenticatorService;
  @service declare sessionTokenStorage: SessionTokenStorageService;

  #consumer() {
    if (!this._cachedConsumer) {
      this._cachedConsumer = createConsumer(`${config.x.backendUrl}/cable?session_token=${this.sessionTokenStorage.currentToken}`);
    }

    return this._cachedConsumer;
  }

  // Returns object with send(data) and unsubscribe() methods
  subscribe(
    channel: string,
    args: Record<string, string> = {},
    callbacks: {
      onConnect?: () => void;
      onDisconnect?: () => void;
      onData?: (data: string) => void;
    },
  ) {
    console.log('connecting...');

    return this.#consumer().subscriptions.create(
      { channel, ...args },
      {
        connected: callbacks.onConnect,
        disconnected: callbacks.onDisconnect,
        received: callbacks.onData,
      },
    );
  }
}
