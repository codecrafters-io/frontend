/**
 * This is a Vercel Middleware, which:
 * - is triggered for contest routes
 * - extracts contest slug from the URL
 * - determines a proper OG Image URL and other meta tags
 * - reads the contents of `dist/_empty.html`
 * - replaces OG meta tags with correct ones
 * - serves the result as an HTML response
 * - passes request down the stack and returns if unable to extract parameters
 *
 * Related Docs:
 * - https://vercel.com/docs/functions/edge-middleware
 * - https://nodejs.org/api/esm.html#importmeta
 * - https://vercel.com/docs/functions/edge-functions/vercel-edge-package#next
 * - https://github.com/pillarjs/path-to-regexp
 */

import { next } from '@vercel/edge';
import { replaceAllMetaTags } from './app/utils/replace-meta-tag';

export const config = {
  // Limit the middleware to run only for contest routes
  // RegExp syntax uses rules from pillarjs/path-to-regexp
  matcher: ['/contests/:path*'],
};

const contestDetailsMap = {
  default: {
    imageUrl: '/assets/images/contest-og-images/og-amazon-contest-1.png',
    title: 'CodeCrafters Contests',
    description: 'Compete in this contest only on CodeCrafters.',
  },
  'amazon-1': {
    imageUrl: '/assets/images/contest-og-images/og-amazon-contest-1.png',
    title: 'CodeCrafters x Amazon',
    description: 'Compete in the first ever contest exclusively for Amazonians on CodeCrafters.',
  },
  'github-1': {
    imageUrl: '/assets/images/contest-og-images/og-amazon-contest-1.png',
    title: 'CodeCrafters x GitHub',
    description: 'Compete in the first ever contest exclusively for Hubbers on CodeCrafters.',
  },
  'vercel-1': {
    imageUrl: '/assets/images/contest-og-images/og-amazon-contest-1.png',
    title: 'CodeCrafters x Vercel',
    description: 'Compete in the first ever contest exclusively for Vercelians on CodeCrafters.',
  },
};

function getContestDetails(slug) {
  if (!(slug in contestDetailsMap)) {
    return contestDetailsMap['default'];
  }

  return contestDetailsMap[slug];
}

export default async function middleware(request) {
  // Parse the contest path match result from the request URL
  const contestsPathMatchResult = request.url.match(/\/contests\/([^/?]+)/);

  // Skip the request if contest slug is missing
  if (!contestsPathMatchResult) {
    // Log an error to the console
    console.error('Unable to parse contest slug from the URL:', request.url);

    // Pass the request down the stack for processing and return
    return next(request);
  }

  const contestSlug = contestsPathMatchResult[1];

  // Fetch contest details from the hashmap
  const contestDetails = getContestDetails(contestSlug);

  // Override OG tag values for the contest
  const pageImageUrl = contestDetails.imageUrl;
  const pageTitle = contestDetails.title;
  const pageDescription = contestDetails.description;

  // Determine URL for reading local `/dist/_empty.html`
  const indexFileURL = new URL('./dist/_empty.html', import.meta.url);

  // Read contents of `/dist/_empty.html`
  const indexFileText = await fetch(indexFileURL).then((res) => res.text());

  // Overwrite content of required meta tags with newer ones
  const responseText = replaceAllMetaTags(indexFileText, pageTitle, pageDescription, pageImageUrl);

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
