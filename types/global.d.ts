// Types for compiled templates
declare module 'codecrafters-frontend/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';

  const tmpl: TemplateFactory;
  export default tmpl;
}

// Not sure if this is supposed to go here...
import '@glint/environment-ember-loose';
