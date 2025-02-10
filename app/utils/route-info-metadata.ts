export enum RouteColorScheme {
  Light,
  Dark,
  Both,
}

export enum HelpscoutBeaconVisibility {
  Visible,
  Hidden,
}

export default class RouteInfoMetadata {
  colorScheme: RouteColorScheme = RouteColorScheme.Light;
  beaconVisibility: HelpscoutBeaconVisibility = HelpscoutBeaconVisibility.Visible;

  constructor({
    colorScheme = RouteColorScheme.Light,
    beaconVisibility = HelpscoutBeaconVisibility.Visible,
  }: { colorScheme?: RouteColorScheme; beaconVisibility?: HelpscoutBeaconVisibility } = {}) {
    this.colorScheme = colorScheme;
    this.beaconVisibility = beaconVisibility;
  }
}
