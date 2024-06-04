import Controller from '@ember/controller';
import { service } from '@ember/service';
import type LocalStorageService from 'codecrafters-frontend/services/local-storage';
import { LOCAL_STORAGE_KEY, type LocalStoragePreference } from 'codecrafters-frontend/services/dark-mode';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';

export default class DemoDarkModeToggleController extends Controller {
  @service declare localStorage: LocalStorageService;

  @tracked currentLocalStoragePreference?: LocalStoragePreference;

  @action loadDarkModePreference() {
    this.currentLocalStoragePreference = this.localStorage.getItem(LOCAL_STORAGE_KEY) as LocalStoragePreference;
  }
}
