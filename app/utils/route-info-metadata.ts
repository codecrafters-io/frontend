export enum RouteColorScheme {
  Light,
  Dark,
  Both,
}

export enum HelpscoutBeaconVisibility {
  Show,
  Hide,
}

export default class RouteInfoMetadata {
  colorScheme: RouteColorScheme = RouteColorScheme.Light;
  beaconVisibility: HelpscoutBeaconVisibility = HelpscoutBeaconVisibility.Show;

  constructor({
    colorScheme = RouteColorScheme.Light,
    beaconVisibility = HelpscoutBeaconVisibility.Show,
  }: { colorScheme?: RouteColorScheme; beaconVisibility?: HelpscoutBeaconVisibility } = {}) {
    this.colorScheme = colorScheme;
    this.beaconVisibility = beaconVisibility;
  }
}
