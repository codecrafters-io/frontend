/**
 * Converts a Request used to access a Prerender Function into a proper URL for
 * pre-rendering an Ember route with FastBoot.
 *
 * Strips `/prerender` from the start of the path, since it's the entry point
 * to prerender functions.
 *
 * Functions whose name are wrapped in [] are considered "wildcard" functions,
 * in which case a corresponding dynamic segment with same name should be present
 * in the Vercel rewrite rule. The wildcard function name in the path will be
 * replaced with the value of the dynamic segment.
 *
 * @param {Request} request Vercel Request received by the Prerender Function.
 * @returns {string} Resolved Ember path to pre-render using FastBoot.
 * @example
  Considering the following Vercel rewrite rules:
  ```
  /demo/code-mirror -> /prerender/demo/code-mirror
  /users/:user -> /prerender/users/[user]
  /concepts/:concept -> /prerender/concepts/[concept]
  /test -> /prerender/test
  ```
  Requesting URLs below will result in corresponding rewrites to Prerender
  Functions and the following FastBoot paths:
  ```
  /demo/code-mirror -> /prerender/demo/code-mirror -> /demo/code-mirror
  /users/abcde -> /prerender/users/[user]?user=abcde -> /users/abcde
  /concepts/xyzqwe -> /prerender/concepts/[concept]?concept=xyzqwe -> /concepts/xyzqwe
  /test?abc=xyz -> /prerender/test -> /test
  ```
 */
export default function parsePrerenderPath({ url, query }) {
  // Parse and prepare the initial path
  const path = (url || '/')
    .replace(/\?(.*)$/, '') // strip query parameters
    .replace(/^\/prerender(\/|$)/, '/') // strip /prerender from the beginning
    .split('/') // split the path into pieces
    .filter((p) => !!p); // filter out empty elements

  // Determine the name by which this function was routed to
  const functionName = path[path.length - 1];

  if (!functionName) {
    throw new Error('Failed to parse function name from the URL');
  }

  // If function name is wrapped in [], for example [user] - it's a wildcard
  // function, it's name must be stripped from the path and replaced with a
  // value of the dynamic segment in the rewrite rule
  if (/^\[([^\s]+)\]$/.test(functionName)) {
    // Expect the dynamic segment name to be same as function name without []
    const dynamicSegmentName = functionName.replace(/^\[(.+)\]$/, '$1');

    // Dynamic segments from rewrite rules are passed by Vercel via queryParams
    const queryParamValue = query[dynamicSegmentName];

    if (!queryParamValue) {
      throw new Error('Failed to read query param with dynamic segment value');
    }

    // Replace the function name in the path with dynamic segment value
    path.pop();
    path.push(queryParamValue);
  }

  // Parse the search string (query params)
  // const search = (url || '').match(/\?(.*)$/)[0] || '';

  // Return the full path
  return `/${path.join('/')}`;
}
