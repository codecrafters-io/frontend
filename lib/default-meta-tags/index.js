'use strict';

const path = require('path');
const fs = require('fs');
const { encode } = require('html-entities');

module.exports = {
  name: require('./package').name,

  parentConfig: {},
  parentEnv: 'production',

  isDevelopingAddon() {
    return true;
  },

  postBuild({ directory }) {
    const emptyHtmlPath = path.resolve(directory, '_empty.html');

    if (!fs.existsSync(emptyHtmlPath)) {
      return;
    }

    const { x: { defaultMetaTags = {} } = {} } = this.parentConfig;

    const metaTags = [
      ['name', 'description', defaultMetaTags.description],
      ['property', 'og:type', defaultMetaTags.type],
      ['property', 'og:site_name', defaultMetaTags.siteName],
      ['property', 'og:title', defaultMetaTags.title],
      ['property', 'og:description', defaultMetaTags.description],
      ['property', 'og:image', defaultMetaTags.imageUrl],
      ['name', 'twitter:card', defaultMetaTags.twitterCard],
      ['name', 'twitter:site', defaultMetaTags.twitterSite],
      ['name', 'twitter:title', defaultMetaTags.title],
      ['name', 'twitter:description', defaultMetaTags.description],
      ['name', 'twitter:image', defaultMetaTags.imageUrl],
    ];

    const metaString = metaTags
      .map(([namePrefix, nameSuffix, content]) => {
        return `<meta ${namePrefix}="${nameSuffix}" content="${encode(content)}">`;
      })
      .join('\n    ');

    fs.writeFileSync(emptyHtmlPath, fs.readFileSync(emptyHtmlPath, 'utf8').replace('<!-- DEFAULT_META_TAGS -->', metaString));
    console.debug('Inserted default meta tags into _empty.html file');
  },

  config(parentEnv, parentConfig) {
    this.parentEnv = parentEnv;
    this.parentConfig = parentConfig;
  },
};
