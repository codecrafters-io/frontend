export default class RouteInfoMetadata {
  isDarkRoute: boolean = false;

  constructor({ isDarkRoute = false }: { isDarkRoute?: boolean } = {}) {
    this.isDarkRoute = isDarkRoute;
  }
}
