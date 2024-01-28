import config from 'codecrafters-frontend/config/environment';
import * as shiki from 'shiki';

/**
 * getHighlighter() is the most expensive step of Shiki. Instead of calling it on every page,
 * cache it here as much as possible. Make sure that your highlighters can be cached, state-free.
 * We make this async, so that multiple calls to parse markdown still share the same highlighter.
 */
const highlighterCacheAsync = new Map();

export default function getOrCreateCachedHighlighterPromise(cacheId: string, options: shiki.HighlighterOptions): Promise<shiki.Highlighter> {
  shiki.setCDN('https://unpkg.com/shiki@0.14.7/');

  if (!highlighterCacheAsync.has(cacheId)) {
    let highlighterPromise: Promise<shiki.Highlighter>;

    if (config.environment === 'test' || !window.fetch || !window.XMLHttpRequest) {
      // Ignore error for now!
      highlighterPromise = new Promise((resolve) => {
        resolve({
          codeToHtml: (code: string) => {
            const lineSpans = code
              .split('\n')
              .map((line) => `<span>${line}</span>`)
              .join('\n');

            return `<pre><code>${lineSpans}</code></pre>`;
          },
          loadLanguage: (_language: string) => {
            return new Promise((resolve) => {
              resolve();
            }) as Promise<void>;
          },
        } as unknown as shiki.Highlighter);
      });
    } else {
      highlighterPromise = shiki.getHighlighter(options);
    }

    highlighterCacheAsync.set(cacheId, highlighterPromise);
  }

  return highlighterCacheAsync.get(cacheId);
}

export async function preloadHighlighter(cacheId: string, options: shiki.HighlighterOptions, languages?: string[]) {
  const highlighter = await getOrCreateCachedHighlighterPromise(cacheId, options);

  await Promise.all(
    (languages || []).map((language) => {
      highlighter.loadLanguage(language as shiki.Lang);
    }),
  );
}
