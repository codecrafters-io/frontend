import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';

export default class IntroductionController extends Controller {
  declare model: CourseRouteModelType;

  @service declare authenticator: AuthenticatorService;
}
