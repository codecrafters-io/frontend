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
        URLSearchParams,
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

  // Render a generic page if the status code is not 200
  if (statusCode !== 200) {
    console.warn('FastBoot response statusCode was:', statusCode);
    response.send(fs.readFileSync('dist/_empty.html', 'utf-8'));

    return;
  }

  // Get the HTML content of the FastBoot response & send it as result
  response.send(await result.html());
}
