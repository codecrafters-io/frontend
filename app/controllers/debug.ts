import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';

export default class DebugController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare versionTracker: VersionTrackerService;

  @action
  handleTestSentryClick() {
    // @ts-expect-error this is supposed to raise an error
    this.testingSentry.boom();
  }
}
