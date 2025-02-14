import fs from 'fs';
import FastBoot from 'fastboot';

export default async function (request, response) {
  const { username } = request.query;

  // Check if username query parameter is provided
  if (!username) {
    console.error('Missing "username" query parameter');
    response.redirect('/404');

    return;
  }

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

  // Visit the user profile page
  const result = await app.visit(`/users/${username}`, {
    html: fs.readFileSync('dist/_empty_notags.html', 'utf-8'),
  });
  const statusCode = result._fastbootInfo.response.statusCode;

  // Redirect to 404 page if the status code is not 200
  if (statusCode !== 200) {
    console.warn('Error parsing FastBoot response, statusCode was:', statusCode);
    response.redirect('/404');

    return;
  }

  // Get the HTML content of the FastBoot response
  const html = await result['html'](); // Weird VSCode syntax highlighting issue if written as result.html()

  // Send the HTML content as result
  response.send(html);
}
