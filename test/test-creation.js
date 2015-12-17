/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var slugify = require('underscore.string/slugify');

var expectedFiles = [
  'Gruntfile.js',
  'package.json',
  'bower.json',
  'app/main.html',
  'app/scripts/main.js',
  'app/styles/main.css',
  'index.html',
  'lib/Agave.js',
  'lib/api-client-auth.html',
  'lib/resources/adama',
  'lib/resources/apps',
  'lib/resources/auth',
  'lib/resources/clients',
  'lib/resources/files',
  'lib/resources/index.json',
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
  'lib/swagger/swagger.js',
  'lib/test-runner.js',
  '.editorconfig',
  '.gitignore',
  '.gitattributes',
  '.jshintrc'
];

var appName = 'testApp';
var appNameSlug = slugify(appName);
var appDesc = 'testApp description';

describe('aip-science-app generator', function () {
  describe('running the generator', function() {

    before(function (done) {
      var testPath = path.join(__dirname, 'temp');
      helpers.testDirectory(testPath, function (err) {
        if (err) {
          return done(err);
        }

        helpers.run(path.join( __dirname, '../app'))
          .inDir(testPath)
          .withPrompts({
            'appName': appName,
            'appDesc': appDesc
          })
          .on('end', done);
      });
    });

    it('creates expected files', function () {
      assert.file(expectedFiles);
    });

    it('templated files are created correctly', function() {
      assert.fileContent('package.json', '"name": "' + appNameSlug + '"');
      assert.fileContent('Gruntfile.js', 'appName: \'' + appNameSlug + '\'');
      assert.fileContent('bower.json', '"name": "' + appNameSlug + '"');
      assert.fileContent('araport-app.json', '"name": "' + appName + '"');
      assert.fileContent('araport-app.json', '"description": "' + appDesc + '"');
      assert.fileContent('app/main.html', 'data-app-name="' + appNameSlug + '"');
    });
  });

  describe('including libraries', function() {

    before(function (done) {
      var testPath = path.join(__dirname, 'temp');
      helpers.testDirectory(testPath, function (err) {
        if (err) {
          return done(err);
        }

        helpers.run(path.join( __dirname, '../app'))
          .inDir(testPath)
          .withPrompts({
            'appName': appName,
            'appDesc': appDesc,
            'libraries': ['includeBioJS']
          })
          .on('end', done);
      });
    });

    it('includes selected libraries', function () {
      assert.fileContent('bower.json', '"biojs": "biojs/biojs#v1.0"');
    });
  });
});
