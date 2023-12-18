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
  // Limit the middleware to run only for user profile routes
  // RegExp syntax uses rules from pillarjs/path-to-regexp
  matcher: '/users/:path*',
};

export default async function middleware(request) {
  // Parse the username from the request URL
  const username = request.url.match(/\/users\/([^/?]+)/)[1];

  // Skip the request if username is missing
  if (!username) {
    // Log an error to the console
    console.error('Unable to parse username from the URL:', request.url);

    // Pass the request down the stack for processing and return
    return next(request);
  }

  // Generate a proper OG Image URL for the username's Profile
  const profileImageUrl = `https://og.codecrafters.io/api/user_profile/${username}.png`;
  const pageTitle = `${username}'s CodeCrafters Profile`;
  const pageDescription = `View ${username}'s profile on CodeCrafters`;

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
    ['property', 'og:image', profileImageUrl],
    ['name', 'twitter:title', pageTitle],
    ['name', 'twitter:description', pageDescription],
    ['name', 'twitter:image', profileImageUrl],
  ].reduce((text, args) => replaceMetaTag(text, ...args), indexFileText);

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
