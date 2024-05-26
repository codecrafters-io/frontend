export default class RouteInfoMetadata {
  isDarkRoute = false;

  constructor({ isDarkRoute = false }: { isDarkRoute?: boolean } = {}) {
    this.isDarkRoute = isDarkRoute;
  }
}
