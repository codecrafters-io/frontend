import fs from 'fs';
import FastBoot from 'fastboot';

function parsePrerenderPath(request) {
  const {
    url,
    query: { suffix },
  } = request;

  let prefix = (url || '/')
    .replace(/\?(.*)$/, '') // strip query parameters
    .replace(/^\/prerender\//, '/') // strip /prerender
    .replace(/([^^])\/$/, '$1'); // strip trailing /

  if (suffix) {
    prefix = prefix.replace(/((\/[^/]+))$/, '') || '/'; // strip wildcard function name
  }

  if (!prefix) {
    throw new Error('Failed to parse prerender path prefix');
  }

  return `${[prefix, suffix].filter((e) => !!e).join('/')}` || '/';
}

export default async function (request, response) {
  // Initialize a FastBoot instance
  const app = new FastBoot({
    distPath: 'dist',
    resilient: false,

    // Customize the sandbox globals
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        AbortController,
      });
    },

    maxSandboxQueueSize: 1,
  });

  // Visit the requested path
  const result = await app.visit(parsePrerenderPath(request), {
    html: fs.readFileSync('dist/_empty_notags.html', 'utf-8'),
  });

  // Parse status code
  const statusCode = result._fastbootInfo.response.statusCode;

  // Redirect to 404 page if the status code is not 200
  if (statusCode !== 200) {
    console.warn('FastBoot response statusCode was:', statusCode);
    response.redirect('/404');

    return;
  }

  // Get the HTML content of the FastBoot response
  const html = await result['html'](); // Weird VSCode syntax highlighting issue if written as result.html()

  // Send the HTML content as result
  response.send(html);
}
