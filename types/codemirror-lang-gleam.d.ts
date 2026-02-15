declare module '@exercism/codemirror-lang-gleam' {
  import type { LanguageSupport, LRLanguage } from '@codemirror/language';

  export const gleamLanguage: LRLanguage;
  export function gleam(config?: object): LanguageSupport;
}
