// Types for compiled templates
// This doesn't work?
// declare module 'codecrafters-frontend/templates/*' {
//   import { TemplateFactory } from 'ember-cli-htmlbars';

//   const tmpl: TemplateFactory;
//   export default tmpl;
// }

// Not sure if this is supposed to go here...
import '@glint/environment-ember-loose';

declare global {
  namespace EmberTooltip {}
}