// Karma configuration.
// Generated for Angular 17 + Windows-friendly headless Chrome.
// Docs: https://karma-runner.github.io/6.4/config/configuration-file.html

const path = require('path');
const os = require('os');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // random: false keeps test order stable while iterating.
        random: false,
      },
      clearContext: false, // leave Jasmine spec runner output visible
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, './coverage/mawuli'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // Default browser — headless so it works in CI and avoids the "Chrome
    // window opens but never captures" loop on Windows / OneDrive-synced repos.
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-translate',
          '--disable-extensions',
          '--disable-features=Translate,InterestCohort',
          // Each test run gets a unique profile dir — avoids locks from
          // any leftover Chrome process and keeps OneDrive out of it.
          // No hardcoded --remote-debugging-port (causes collisions across runs).
          '--user-data-dir=' +
            path.join(
              os.tmpdir(),
              'karma-chrome-' + process.pid + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
            ),
        ],
      },
      // Use this when you want to see what's happening in a real Chrome window:
      //   ng test --browsers=ChromeDebug
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--disable-extensions'],
      },
    },
    captureTimeout: 120000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 60000,
    singleRun: false,
    restartOnFileChange: true,
  });
};
