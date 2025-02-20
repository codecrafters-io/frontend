/**
 * This is a Vercel Middleware, which:
 * - is triggered for concept or contest routes
 * - extracts concept or contest slug from the URL
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
  // Limit the middleware to run only for concept and contest routes
  // RegExp syntax uses rules from pillarjs/path-to-regexp
  matcher: ['/concepts/:path*', '/contests/:path*'],
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
  // Parse the concept or contest path match result from the request URL
  const conceptsPathMatchResult = request.url.match(/\/concepts\/([^/?]+)/);
  const contestsPathMatchResult = request.url.match(/\/contests\/([^/?]+)/);

  // Skip the request if concept or contest slug is missing
  if (!conceptsPathMatchResult && !contestsPathMatchResult) {
    // Log an error to the console
    console.error('Unable to parse concept or contest slug from the URL:', request.url);

    // Pass the request down the stack for processing and return
    return next(request);
  }

  let pageImageUrl;
  let pageTitle;
  let pageDescription;

  if (conceptsPathMatchResult) {
    const conceptSlug = conceptsPathMatchResult[1];

    // Convert the slug('network-protocols') to title('Network Protocols')
    // Use this as a fallback
    let conceptTitle = conceptSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Use this as a fallback
    let conceptDescription = `View the ${conceptTitle} concept on CodeCrafters`;

    // Get concept data from the backend
    try {
      const conceptData = await (
        await fetch(`https://backend.codecrafters.io/services/dynamic_og_images/concept_data?id_or_slug=${conceptSlug}`)
      ).json();
      conceptTitle = conceptData.title;
      conceptDescription = conceptData.description_markdown;
    } catch (e) {
      console.error('Failed to fetch concept data:', e);
    }

    // Override OG tag values for the concept
    pageImageUrl = `https://og.codecrafters.io/api/concept/${conceptSlug}`;
    pageTitle = conceptTitle;
    pageDescription = conceptDescription;
  } else if (contestsPathMatchResult) {
    const contestSlug = contestsPathMatchResult[1];

    // Fetch contest details from the hashmap
    const contestDetails = getContestDetails(contestSlug);

    // Override OG tag values for the contest
    pageImageUrl = contestDetails.imageUrl;
    pageTitle = contestDetails.title;
    pageDescription = contestDetails.description;
  }

  // Determine URL for reading local `/dist/_empty.html`
  const indexFileURL = new URL('./dist/_empty.html', import.meta.url);

  // Read contents of `/dist/_empty.html`
  const indexFileText = await fetch(indexFileURL).then((res) => res.text());

  // Overwrite content of required meta tags with newer ones
  const responseText = replaceAllMetaTags(indexFileText, pageTitle, pageDescription, pageImageUrl);

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
