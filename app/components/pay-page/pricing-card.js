import Component from '@glimmer/component';

export default class PricingCardComponent extends Component {
  get featureDescriptions() {
    return [
      `All modules without limits`,
      `Expert approaches for all stages`,
      `Members community for Q&A`,
      `Download invoice for expensing`,
      `Private leaderboard for your team`,
      `Cancel anytime`,
    ];
  }
}
