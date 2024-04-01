import Controller from '@ember/controller';
import { service } from '@ember/service';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';

export default class DebugController extends Controller {
  @service declare versionTracker: VersionTrackerService;
}
