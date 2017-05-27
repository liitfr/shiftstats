#!/usr/bin/env node
const path = require('path');
const extend = require('util')._extend;

const baseDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(baseDir);
const processes = require('./processes.js');

const isCi = process.argv[2] === '--ci';

const startTestApp = (onStarted, options) => {
  processes.start({
    name: 'Test App',
    command: `meteor --settings ${srcDir}/.testing/settings.json --port=3100`,
    waitForMessage: 'App running at: http://localhost:3100',
    options: {
      cwd: srcDir,
      env: extend(process.env, options),
    },
  }, () => {
    console.log('Test app is running …');
    onStarted();
  });
};

const startChimpWatch = () => {
  processes.start({
    name: 'Chimp Watch',
    command: 'chimp --ddp=http://localhost:3100 --watch --path=tests --mocha --chai --browser=chrome',
    options: { cwd: baseDir },
  });
};

const startChimpCi = () => {
  const command = 'chimp --ddp=http://localhost:3100 --path=tests --browser=chrome --mocha --chai';
  processes.start({
    name: 'Chimp CI',
    command,
    options: { cwd: baseDir },
  });
};

if (isCi) {
  // CI mode -> run once
  if (process.env.CIRCLECI) {
    startTestApp(startChimpCi);
  } else {
    // Use a different db for local ci testing to avoid nuking of the dev db
    startTestApp(startChimpCi, {
      MONGO_URL: 'mongodb://localhost/chimp_db',
    });
  }
} else {
  // DEV mode -> watch
  startTestApp(startChimpWatch, {
    MONGO_URL: 'mongodb://localhost/chimp_db',
  });
}
