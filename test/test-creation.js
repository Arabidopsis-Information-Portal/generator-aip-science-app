/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var md5 = require('MD5');
var helpers = require('yeoman-generator').test;

var expectedFiles = [
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

var fileHashes = [
  'c16b6e720f026f108e36bcc7848bba31',
  '1459a346e4d52601eecee4b3ae74b1e8',
  '707d23bec838d663ec0086d4e9d70bec',
  '959adea3ffb26c065688feebd625b0ba',
  'bf889f7352b3160da034f97b8f0ee302',
  'd41d8cd98f00b204e9800998ecf8427e',
  '959adea3ffb26c065688feebd625b0ba',
  'bf889f7352b3160da034f97b8f0ee302',
  'd41d8cd98f00b204e9800998ecf8427e',
  '94c681de0434aa69ac893ba203203e25',
  '86da4a2848487ad90a55a1ab5006e53d',
  '3f0637b5ad62e13600323b6cbc9dd6cb',
  '57c8e089acd7437c55280ec04792299d',
  'a30a55d17c507c18b32030ce5a4ecb0a',
  '8fc4a823f390ded3efe13f7715957236',
  'aee0efbf907cac13bf6fbdcede8fd35a',
  '9b4efd85a6f5dd424dd312d51d9f5c4f',
  '6ff416f09faef493c60499b77d0aac80',
  'bd2ae06061aee8300ecde6babadc92c2',
  'c1a27c726508768133e89f3775cc0698',
  'c19281d4dc991cbb945f409e2ecbb81d',
  '939e7d8b3378d47d80969abd30f4f604',
  'b86f3fee2cbc74f972e474378c6061ee',
  '84d7f92aa73237209d3b0bb3338a010c',
  '8ebb66340c4edcc4e295fe7280f2e017',
  '8c1d2884f75b17182540be041b928e47',
  '410cd18a42d0d0dc56e7045351ee5072',
  '45fda0c924f94193200fa29a3a767b03',
  'c1fe22d6b50ce53b1f36884245dd28cb',
  '779134582753ab4ed07a43a40349ca99',
  '59629b3bf5e0281fede760ec69e751cc',
  '75f9e2bcd55b8bd940c605865e0b0f33'
];

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
    helpers.mockPrompt(this.app, {
      'libraries': ['includeBioJS']
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      done();
    });
  });

  it('templated files are created correctly', function(done) {

    helpers.mockPrompt(this.app, {
      'libraries': ['includeBioJS']
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      for (var i = 0; i < expectedFiles.length; i++) {
        fs.readFileSync(path.join(__dirname, 'temp', expectedFiles[i]), 'utf8', function(err, data) {
          if (err) {
            return console.log(err);
          }
          helpers.assertTextEqual(md5(data), fileHashes[i]);
        });
      }

      done();
    });
  });
});
