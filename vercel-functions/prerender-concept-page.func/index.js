import FastBoot from 'fastboot';
import { replaceAllMetaTags } from './replace-meta-tag.js';

export default async function (request, response) {
  const { conceptSlug } = request.query;

  // Check if conceptSlug query parameter is provided
  if (!conceptSlug) {
    console.error('Missing "conceptSlug" query parameter');
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
        URLSearchParams,
      });
    },

    maxSandboxQueueSize: 1,
  });

  // Visit the concept page
  const result = await app.visit(`/concepts/${conceptSlug}`);
  const statusCode = result._fastbootInfo.response.statusCode;

  // Redirect to 404 page if the status code is not 200
  if (statusCode !== 200) {
    console.warn('Error parsing FastBoot response, statusCode was:', statusCode);
    response.redirect('/404');

    return;
  }

  // Get the HTML content of the FastBoot response
  const html = await result['html']();

  // Define meta tag values
  let pageTitle;
  let pageDescription;
  const pageImageUrl = `https://og.codecrafters.io/api/concept/${conceptSlug}`; // TODO: use `metaTagConceptImageBaseURL` from config

  // Get concept data from the backend
  try {
    const conceptDataRaw = await fetch(`https://backend.codecrafters.io/services/dynamic_og_images/concept_data?id_or_slug=${conceptSlug}`);
    const conceptData = await conceptDataRaw.json();
    pageTitle = conceptData.title;
    pageDescription = conceptData.description_markdown;
  } catch (e) {
    console.error('Failed to fetch concept data:', e);
    pageTitle = conceptSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    pageDescription = `View the ${pageTitle} concept on CodeCrafters`;
  }

  // Replace meta tags in the HTML content
  const responseText = replaceAllMetaTags(html, pageTitle, pageDescription, pageImageUrl);

  // Send the modified HTML content as the response
  response.send(responseText);
}
