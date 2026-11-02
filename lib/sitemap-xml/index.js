'use strict';

const fs = require('fs');
const path = require('path');
const { encode } = require('html-entities');
const fetchCourses = require('../fetch-courses');

// Same rules as the track page: public beta/live courses, and tracks with at least one of them.
function sitemapPaths({ data = [], included = [] }) {
  const courses = data.filter(({ attributes }) => attributes.visibility === 'public' && ['beta', 'live'].includes(attributes['release-status']));
  const courseIds = new Set(courses.map(({ id }) => id));
  const languageSlugsById = new Map(included.filter(({ type }) => type === 'languages').map(({ id, attributes }) => [id, attributes.slug]));

  const trackSlugs = included
    .filter(({ type, attributes }) => type === 'course-language-configurations' && attributes['release-status'] !== 'alpha')
    .filter(({ relationships }) => courseIds.has(relationships.course?.data?.id))
    .map(({ relationships }) => languageSlugsById.get(relationships.language?.data?.id))
    .filter(Boolean);

  return [
    '/catalog',
    ...courses.map(({ attributes }) => `/courses/${attributes.slug}/overview`).sort(),
    ...[...new Set(trackSlugs)].sort().map((slug) => `/tracks/${slug}`),
  ];
}

function sitemapXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${encode(url, { level: 'xml' })}</loc></url>`),
    '</urlset>',
  ];

  return `${lines.join('\n')}\n`;
}

module.exports = {
  name: require('./package').name,

  parentConfig: {},

  isDevelopingAddon() {
    return true;
  },

  async postBuild({ directory }) {
    // `_empty.html` only exists in prerendered (production) builds
    if (!fs.existsSync(path.resolve(directory, '_empty.html'))) {
      return;
    }

    const { x: { backendUrl, canonicalBaseUrl } = {} } = this.parentConfig;
    const urls = sitemapPaths(await fetchCourses(backendUrl)).map((sitemapPath) => `${canonicalBaseUrl}${sitemapPath}`);

    fs.writeFileSync(path.resolve(directory, 'sitemap.xml'), sitemapXml(urls));
    console.debug(`Wrote sitemap.xml with ${urls.length} URLs`);
  },

  config(parentEnv, parentConfig) {
    this.parentConfig = parentConfig;
  },
};
