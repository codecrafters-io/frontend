/**
 * This is a Vercel Middleware, which:
 * - is triggered for all `/users/:username` routes
 * - extracts `username` from the URL
 * - generates a proper Profile OG Image URL
 * - reads the contents of `dist/_empty.html`
 * - replaces `<meta name="description" ...` with proper page description
 * - replaces `<meta property="og:title" ...` with proper page title
 * - replaces `<meta property="og:description" ...` with proper page description
 * - replaces `<meta property="og:image" ...` with Profile OG Image URL
 * - replaces `<meta name="twitter:title" ...` with proper page title
 * - replaces `<meta name="twitter:description" ...` with proper page description
 * - replaces `<meta name="twitter:image" ...` with Profile OG Image URL
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

  // Replace content of meta tags to use Profile Image URL & proper Page Titles
  const responseText = indexFileText
    .replace(
      // Change Description
      /<meta\s+name=(["'])(description)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta name=$1$2$1 content=$3${pageDescription}$3$5`,
    )
    .replace(
      // Change OG Image to Profile Image URL
      /<meta\s+property=(["'])(og:image)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta property=$1$2$1 content=$3${profileImageUrl}$3$5`,
    )
    .replace(
      // Change OG Title
      /<meta\s+property=(["'])(og:title)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta property=$1$2$1 content=$3${pageTitle}$3$5`,
    )
    .replace(
      // Change OG Description
      /<meta\s+property=(["'])(og:description)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta property=$1$2$1 content=$3${pageDescription}$3$5`,
    )
    .replace(
      // Change Twitter Image to Profile Image URL
      /<meta\s+name=(["'])(twitter:image)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta name=$1$2$1 content=$3${profileImageUrl}$3$5`,
    )
    .replace(
      // Change Twitter Title
      /<meta\s+name=(["'])(twitter:title)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta name=$1$2$1 content=$3${pageTitle}$3$5`,
    )
    .replace(
      // Change Twitter Description
      /<meta\s+name=(["'])(twitter:description)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta name=$1$2$1 content=$3${pageDescription}$3$5`,
    );

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
