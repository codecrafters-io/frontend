import '@glint/environment-ember-loose';

// https://github.com/typed-ember/ember-cli-typescript/issues/1482, https://github.com/glimmerjs/glimmer.js/issues/408
declare module '@glimmer/tracking' {
  export const cached: PropertyDecorator;
}
