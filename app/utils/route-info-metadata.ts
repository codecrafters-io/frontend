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
  colorScheme: RouteColorScheme = RouteColorScheme.Both;
  shouldShowHeaderAndFooter = true;

  constructor({
    allowsAnonymousAccess = false,
    beaconVisibility = HelpscoutBeaconVisibility.Visible,
    colorScheme = RouteColorScheme.Both,
    shouldShowHeaderAndFooter = true,
  }: {
    allowsAnonymousAccess?: boolean;
    beaconVisibility?: HelpscoutBeaconVisibility;
    colorScheme?: RouteColorScheme;
    shouldShowHeaderAndFooter?: boolean;
  } = {}) {
    this.allowsAnonymousAccess = allowsAnonymousAccess;
    this.beaconVisibility = beaconVisibility;
    this.colorScheme = colorScheme;
    this.shouldShowHeaderAndFooter = shouldShowHeaderAndFooter;
  }
}
