import FastBoot from 'fastboot';
import { replaceAllMetaTags } from './replace-meta-tag.js';

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
  const result = await app.visit(`/users/${username}`);
  const statusCode = result._fastbootInfo.response.statusCode;

  // Redirect to 404 page if the status code is not 200
  if (statusCode !== 200) {
    console.warn('Error parsing FastBoot response, statusCode was:', statusCode);
    response.redirect('/404');

    return;
  }

  // Get the HTML content of the FastBoot response
  const html = await result['html'](); // Weird VSCode syntax highlighting issue if written as result.html()

  // Define meta tag values
  const pageTitle = `${username}'s CodeCrafters Profile`;
  const pageImageUrl = `https://og.codecrafters.io/api/user_profile/${username}`; // TODO: Read `metaTagUserProfilePictureBaseURL` from page config
  const pageDescription = `View ${username}'s profile on CodeCrafters`;

  // Replace meta tags in the HTML content
  const responseText = replaceAllMetaTags(html, pageTitle, pageDescription, pageImageUrl);

  // Send the modified HTML content as the response
  response.send(responseText);
}
