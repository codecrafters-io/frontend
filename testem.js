'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: false,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
  parallel: process.env.EMBER_EXAM_SPLIT_COUNT,
  src_files: ['tests/**/*.js', 'app/**/*.js', 'app/**/*.hbs', 'mirage/**/*.js'],
};
