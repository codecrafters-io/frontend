import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class AccountController extends Controller {
  @tracked deleteAccountModalIsOpen = false;
}
