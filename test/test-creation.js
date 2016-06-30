/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
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
  'lib/resources/agaveapi.json',
  'lib/resources/agaveapi.yml',
  'lib/resources/Gruntfile.js',
  'lib/resources/package.json',
  'lib/resources/README.md',
  'lib/resources/ui/favicon.ico',
  'lib/resources/ui/index.html',
  'lib/resources/ui/logo.svg',
  'lib/swagger/swagger.js',
  'lib/test-runner.js',
  '.editorconfig',
  '.gitignore',
  '.gitattributes',
  '.jshintrc'
];

var appName = 'Test App';
var appNameSlug = 'test-app';
var appDesc = 'TestApp Description';
var prompts = {
            'appName': appName,
            'appDesc': appDesc
        };
var testPath = path.join(__dirname, 'temp');

describe('aip-science-app generator', function () {

  describe('running the app generator', function() {

    before(function (done) {
      helpers.testDirectory(testPath, function (err) {
        if (err) {
          return done(err);
        }

        helpers.run(path.join( __dirname, '../generators/app'))
          .inDir(testPath)
          .withPrompts(prompts)
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
      helpers.testDirectory(testPath, function (err) {
        if (err) {
          return done(err);
        }

        var withLibraryPrompts = Object.create(prompts);
        withLibraryPrompts.libraries = ['includeBioJS'];
        helpers.run(path.join( __dirname, '../generators/app'))
          .inDir(testPath)
          .withPrompts(withLibraryPrompts)
          .on('end', done);
      });
    });

    it('includes selected libraries', function () {
      assert.fileContent('bower.json', '"biojs": "biojs/biojs#v1.0"');
    });
  });
});
