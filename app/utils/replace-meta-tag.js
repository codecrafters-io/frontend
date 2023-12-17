/**
 * Searches input text for meta tags specified by idAttrName="idAttrValue",
 * overwrites their "content" with newContent and returns the resulting text.
 * @param {string} text Input text to search for meta tags.
 * @param {string} idAttrName Name of meta tag attribute to search for. Example: property
 * @param {string} idAttrValue Value of meta tag attribute to search for. Example: og:title
 * @param {string} newContent New content for the meta tag.
 * @returns {string} Resulting text with meta tags content overwritten.
 * @example
  // returns "<head><meta property="og:title" content="some new title"></head>"
  replaceMetaTag(
    '<head><meta property="og:title" content="some title"></head>',
    'property',
    'og:title',
    'some new title'
  )
 */
export default function replaceMetaTag(text, idAttrName, idAttrValue, newContent) {
  return text.replace(
    new RegExp(`<meta\\s+${idAttrName}=(["'])(${idAttrValue})\\1\\s+content=(["'])([^"']*)\\3(.*?>)`, 'g'),
    `<meta ${idAttrName}=$1$2$1 content=$3${newContent}$3$5`,
  );
}
