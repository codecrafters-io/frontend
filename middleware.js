/**
 * This is a Vercel Middleware, which:
 * - is triggered for all `/users/:username` routes
 * - extracts `username` from the URL
 * - generates a proper Profile OG Image URL
 * - reads the contents of `dist/_empty.html`
 * - replaces OG meta tags with user-profile specific ones: <meta property="og:image" content="...">
 * - serves the result as an HTML response
 * - passes request down the stack and returns if unable to extract `username`
 *
 * Related Docs:
 * - https://vercel.com/docs/functions/edge-middleware
 * - https://nodejs.org/api/esm.html#importmeta
 * - https://vercel.com/docs/functions/edge-functions/vercel-edge-package#next
 * - https://github.com/pillarjs/path-to-regexp
 */

import { next } from '@vercel/edge';
import replaceMetaTag from './app/utils/replace-meta-tag';

export const config = {
  // Limit the middleware to run only for user profile and concept routes
  // RegExp syntax uses rules from pillarjs/path-to-regexp
  matcher: ['/users/:path*', '/concepts/:path*'],
};

export default async function middleware(request) {
  // Parse the username or concept slug from the request URL
  const username = request.url.match(/\/users\/([^/?]+)/)[1];
  const conceptSlug = request.url.match(/\/concepts\/([^/?]+)/)[1];

  // Skip the request if username or concept slug is missing
  if (!username || !conceptSlug) {
    // Log an error to the console
    console.error('Unable to parse username from the URL:', request.url);

    // Pass the request down the stack for processing and return
    return next(request);
  }

  let pageImageUrl;
  let pageTitle;
  let pageDescription;

  if (username) {
    // Generate a proper OG Image URL for the username's Profile
    pageImageUrl = `https://og.codecrafters.io/api/user_profile/${username}`;
    pageTitle = `${username}'s CodeCrafters Profile`;
    pageDescription = `View ${username}'s profile on CodeCrafters`;
  }

  if (conceptSlug) {
    // Convert the slug('network-protocols') to title('Network Protocols')
    const conceptTitle = conceptSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Generate a proper OG Image URL for the concept
    pageImageUrl = `https://og.codecrafters.io/api/concept/${conceptSlug}`;
    pageTitle = conceptTitle;
    pageDescription = `View the ${conceptTitle} concept on CodeCrafters`;
  }

  // Determine URL for reading local `/dist/_empty.html`
  const indexFileURL = new URL('./dist/_empty.html', import.meta.url);

  // Read contents of `/dist/_empty.html`
  const indexFileText = await fetch(indexFileURL).then((res) => res.text());

  // Overwrite content of required meta tags with user-profile specific ones,
  // by sequentially calling `replaceMetaTag` against `indexFileText`,
  // and passing it arguments from the following list:
  const responseText = [
    ['name', 'description', pageDescription], // <meta name="description" content="...">
    ['property', 'og:title', pageTitle],
    ['property', 'og:description', pageDescription],
    ['property', 'og:image', pageImageUrl],
    ['name', 'twitter:title', pageTitle],
    ['name', 'twitter:description', pageDescription],
    ['name', 'twitter:image', pageImageUrl],
  ].reduce((text, args) => replaceMetaTag(text, ...args), indexFileText);

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
