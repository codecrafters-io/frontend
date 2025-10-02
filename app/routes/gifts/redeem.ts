import Route from '@ember/routing/route';

export default class GiftsRedeemRoute extends Route {
  model(params: { secret_code: string }) {
    // TODO: Implement model logic for gift redemption
    return params.secret_code;
  }
}
