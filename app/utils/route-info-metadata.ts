export enum RouteColorSchemes {
  Light,
  Dark,
  Both,
}

export default class RouteInfoMetadata {
  colorScheme: RouteColorSchemes = RouteColorSchemes.Light;

  constructor({ colorScheme = RouteColorSchemes.Light }: { colorScheme?: RouteColorSchemes } = {}) {
    this.colorScheme = colorScheme;
  }
}
