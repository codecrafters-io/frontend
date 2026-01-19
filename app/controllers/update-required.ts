import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';
import { tracked } from '@glimmer/tracking';

export default class UpdateRequiredController extends Controller {
  queryParams = [{ next: 'next' }];

  @service declare versionTracker: VersionTrackerService;
  @tracked isNavigatingToOtherRoute = false;

  // Query params
  @tracked next: string | null = null;

  @action
  handleContinueButtonClick() {
    this.isNavigatingToOtherRoute = true;
    window.location.href = this.next || '/';
  }

  @action
  handleUpdateNowButtonClick() {
    this.isNavigatingToOtherRoute = true;
    window.location.reload();
  }
}
