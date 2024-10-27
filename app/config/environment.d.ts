/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  APP: Record<string, unknown>;
  environment: string;
  modulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  podModulePrefix: string;
  rootURL: string;
  x: {
    backendUrl: string;
    copyConfirmationTimeout: number;
    isCI: boolean;
    metaTagImagesBaseURL: string;
    stripePublishableKey: string;
    version: string;
  };
};

export default config;
