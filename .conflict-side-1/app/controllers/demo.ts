import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class DemoController extends Controller {
  @service declare router: RouterService;
}
