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
  allowsAnonymousAccess = false;
  beaconVisibility: HelpscoutBeaconVisibility = HelpscoutBeaconVisibility.Visible;
  colorScheme: RouteColorScheme = RouteColorScheme.Light;

  constructor({
    allowsAnonymousAccess = false,
    beaconVisibility = HelpscoutBeaconVisibility.Visible,
    colorScheme = RouteColorScheme.Light,
  }: {
    allowsAnonymousAccess?: boolean;
    beaconVisibility?: HelpscoutBeaconVisibility;
    colorScheme?: RouteColorScheme;
  } = {}) {
    this.allowsAnonymousAccess = allowsAnonymousAccess;
    this.beaconVisibility = beaconVisibility;
    this.colorScheme = colorScheme;
  }
}
