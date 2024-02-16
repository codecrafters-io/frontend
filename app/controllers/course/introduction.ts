import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class IntroductionController extends Controller {
  @service declare authenticator: AuthenticatorService;
}
