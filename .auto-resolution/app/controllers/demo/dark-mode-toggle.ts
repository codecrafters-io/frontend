import Controller from '@ember/controller';
import { service } from '@ember/service';
import DarkModeService from 'codecrafters-frontend/services/dark-mode';

export default class DemoDarkModeToggleController extends Controller {
  @service declare darkMode: DarkModeService;
}
