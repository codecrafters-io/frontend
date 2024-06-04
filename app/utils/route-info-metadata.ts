export default class RouteInfoMetadata {
  isDarkRoute = false;
  supportsDarkMode = false; // TODO: Make all routes support dark mode and remove this property

  constructor({ isDarkRoute = false, supportsDarkMode = isDarkRoute }: { isDarkRoute?: boolean; supportsDarkMode?: boolean } = {}) {
    this.isDarkRoute = isDarkRoute;
    this.supportsDarkMode = supportsDarkMode || isDarkRoute;
  }
}
