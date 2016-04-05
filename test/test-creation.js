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

var appName = 'testApp';
var appNameSlug = slugify(appName);
var appDesc = 'testApp description';

var appConfig = {
  scAppNameSlug: appNameSlug,
  scAppName: appName,
  scAppDesc: appDesc,
  scAppHTML: 'main.html',
  scAppScript: 'main.js',
  scAppScriptDir: 'scripts',
  scAppStyle: 'main.css',
  scAppStyleDir: 'styles',
  includeBioJS: false,
  includeCytoscape: false,
  helloWorld: false
};

var testPath = path.join(__dirname, 'temp');

describe('aip-science-app generator', function () {
  describe('running the default generator', function() {

    it('generates the subConfig', function (done) {
      var deps = [
        [helpers.createDummyGenerator(), 'aip-science-app:common']
      ];
      var context = helpers.run(path.join( __dirname, '../generators/app'))
        .withPrompts({
          'appName': appName,
          'appDesc': appDesc
        })
        .withGenerators(deps)
        .on('end', function() {
          assert.equal(appNameSlug, context.generator.subConfig.scAppNameSlug);
          assert.equal(appName, context.generator.subConfig.scAppName);
          assert.equal(appDesc, context.generator.subConfig.scAppDesc);
          done();
        });
    });
  });

  describe('running the common generator', function() {

    before(function (done) {
      helpers.testDirectory(testPath, function (err) {
        if (err) {
          return done(err);
        }

        helpers.run(path.join( __dirname, '../generators/common'))
          .inDir(testPath)
          .withOptions({subConfig: appConfig})
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

        var withLibraryConfig = Object.create(appConfig);
        withLibraryConfig.includeBioJS = true;

        helpers.run(path.join( __dirname, '../generators/common'))
          .inDir(testPath)
          .withOptions({subConfig: withLibraryConfig})
          .on('end', done);
      });
    });

    it('includes selected libraries', function () {
      assert.fileContent('bower.json', '"biojs": "biojs/biojs#v1.0"');
    });
  });
});
