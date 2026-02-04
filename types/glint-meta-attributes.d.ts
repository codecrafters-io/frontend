import type { AttrValue } from '@glint/template/-private/dsl';

declare global {
  interface HTMLMetaElementAttributes {
    ['property']?: AttrValue;
  }
}

export {};
