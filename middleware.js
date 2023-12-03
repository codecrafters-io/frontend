/**
 * This is a Vercel Middleware, which:
 * - is triggered for all `/users/:username` routes
 * - extracts `username` from the URL
 * - generates a proper Profile OG Image URL
 * - reads the contents of `dist/_empty.html`
 * - replaces `<meta proprerty="og:image" ...` with Profile OG Image URL
 * - replaces `<meta name="twitter:image" ...` with Profile OG Image URL
 * - serves the result as an HTML response
 *
 * Related Docs:
 * - https://vercel.com/docs/functions/edge-middleware
 * - https://nodejs.org/api/esm.html#importmeta
 */

export const config = {
  matcher: '/users/:path*',
};

export default async function middleware(request) {
  // Parse the username from the request URL
  const userName = request.url.match(/\/users\/([^/?]+)/)[1];

  // Throw an error if username is missing
  if (!userName) {
    throw new Error('Invalid arguments');
  }

  // Generate a proper OG Image URL for the username's Profile
  const profileImageUrl = `https://og.codecrafters.io/api/user_profile/${userName}.png`;

  // Determine URL for reading local `/dist/_empty.html`
  const indexFileURL = new URL('./dist/_empty.html', import.meta.url);

  // Read contents of `/dist/_empty.html`
  const indexFileText = await fetch(indexFileURL).then((res) => res.text());

  // Replace content of OG & Twitter meta tags to use Profile Image URL
  // prettier-ignore
  const responseText = indexFileText
    .replace(
      /<meta\s+property=(["'])(og:image)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta property=$1$2$1 content=$3${profileImageUrl}$3$5`
    )
    .replace(
      /<meta\s+name=(["'])(twitter:image)\1\s+content=(["'])([^"']*)\3(.*?>)/g,
      `<meta name=$1$2$1 content=$3${profileImageUrl}$3$5`
    );

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
