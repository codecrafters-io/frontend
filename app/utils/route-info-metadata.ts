export enum RouteColorScheme {
  Light,
  Dark,
  Both,
}

export default class RouteInfoMetadata {
  colorScheme: RouteColorScheme = RouteColorScheme.Light;

  constructor({ colorScheme = RouteColorScheme.Light }: { colorScheme?: RouteColorScheme } = {}) {
    this.colorScheme = colorScheme;
  }
}
