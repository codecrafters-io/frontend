/**
 * Converts a Request URL used to access a Prerender Function into a proper URL
 * for pre-rendering an Ember route with FastBoot.
 *
 * Strips `/prerender` from the start of the path, since it's the entry point
 * to Prerender Functions.
 *
 * Functions whose name are wrapped in [] are considered "wildcard" functions,
 * in which case a corresponding dynamic segment with same name should be present
 * in the Vercel rewrite rule. The wildcard function name in the path will be
 * replaced with the value of the dynamic segment. Wildcard function names can
 * contain multiple dynamic segments, such as: [user][subpage]
 *
 * @param {string} url Vercel Request URL received by the Prerender Function.
 * @returns {string} Resolved Ember path to pre-render using FastBoot.
 * @example
  Considering the following Vercel rewrite rules:
  ```
  /demo/code-mirror -> /prerender/demo/code-mirror
  /users/:user -> /prerender/users/[user]
  /concepts/:concept -> /prerender/concepts/[concept]
  /examples/:page/:subpage -> /prerender/examples/[page][subpage]
  /test -> /prerender/test
  ```
  Making requests below will result in corresponding Request URLs received by
  the Prerender Function, and `parsePrerenderPath` will produce the following
  FastBoot paths for such Request URLs:
  ```
  /demo/code-mirror -> /prerender/demo/code-mirror -> /demo/code-mirror
  /users/abcde -> /prerender/users/[user]?user=abcde -> /users/abcde
  /concepts/xyzqwe -> /prerender/concepts/[concept]?concept=xyzqwe -> /concepts/xyzqwe
  /examples/abc/def -> /prerender/examples/[page][subpage]?page=abc&subpage=def -> /examples/abc/def
  /test?abc=xyz -> /prerender/test?abc=xyz -> /test?abc=xyz
  ```
 */
export default function parsePrerenderPath(url = '/') {
  // Parse and prepare the initial path
  const path = (url || '/')
    .replace(/\?(.*)$/, '') // strip query parameters
    .replace(/^\/prerender(\/|$)/, '/') // strip /prerender from the beginning
    .split('/') // split the path into pieces
    .filter((p) => !!p); // filter out empty elements

  // Parse the queryParams
  const queryParams = new URLSearchParams(((url || '').match(/\?(.*)$/) || [])[0] || '');

  // Determine the name by which this function was routed to
  const functionName = path[path.length - 1] || '';

  // If function name is wrapped in [], for example [user] or [user][subpage],
  // then it's a wildcard function, its name must be stripped from the path and
  // replaced with values of dynamic segments in the rewrite rule (queryParams)
  if (/^\[([^\s]+)\]$/.test(functionName)) {
    // Remove the function name from the path
    path.pop();

    // Split the function name into names of dynamic segments: [user][subpage] -> user, subpage
    const dynamicSegmentNames = functionName.replace(/^\[(.+)\]$/, '$1').split('][');

    for (const dynamicSegmentName of dynamicSegmentNames) {
      // Dynamic segments from rewrite rules are passed by Vercel via queryParams
      if (!queryParams.has(dynamicSegmentName)) {
        throw new Error(`Failed to read dynamic segment ${dynamicSegmentName} from query params`);
      }

      // Add dynamic segment value from queryParams to the path
      path.push(queryParams.get(dynamicSegmentName));

      // Remove the dynamic segment query param from queryParams
      queryParams.delete(dynamicSegmentName);
    }
  }

  // Return the full path
  return `/${path.filter((p) => !!p).join('/')}${queryParams.size ? `?${queryParams.toString()}` : ''}`;
}
