import fs from 'fs';
import FastBoot from 'fastboot';
import parsePrerenderPath from './parse-prerender-path.js';

export default async function prerenderEmberRoute(request, response) {
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

  // Determine the prerender path for FastBoot
  const prerenderPath = parsePrerenderPath(request.url);
  console.debug('Parsed prerender path for FastBoot:', prerenderPath);

  // Visit the requested path with FastBoot
  const result = await app.visit(prerenderPath, {
    html: fs.readFileSync('dist/_empty_notags.html', 'utf-8'), // Use the base html file without OG meta tags!
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
