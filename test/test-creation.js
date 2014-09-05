/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('aip-science-app generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('aip-science-app:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'Gruntfile.js',
      'package.json',
      'bower.json',
      'app/app.html',
      'app/scripts/app.js',
      'app/styles/app.css',
      'app/app.html',
      'app/scripts/app.js',
      'app/styles/app.css',
      'index.html',
      'lib/Agave.js',
      'lib/api-client-auth.html',
      'lib/resources/apps',
      'lib/resources/auth',
      'lib/resources/clients',
      'lib/resources/files',
      'lib/resources/index.html',
      'lib/resources/jobs',
      'lib/resources/meta',
      'lib/resources/monitors',
      'lib/resources/notifications',
      'lib/resources/postits',
      'lib/resources/profiles',
      'lib/resources/systems',
      'lib/resources/track',
      'lib/resources/transfers',
      'lib/resources/transforms',
      'lib/test-runner.js',
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      '.jshintrc'
    ];

    helpers.mockPrompt(this.app, {
      'libraries': ['includeBioJS']
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
