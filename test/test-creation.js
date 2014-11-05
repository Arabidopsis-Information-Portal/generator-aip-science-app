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
  'lib/resources/adama',
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
  'lib/swagger/swagger.js',
  'lib/test-runner.js',
  '.editorconfig',
  '.gitignore',
  '.gitattributes',
  '.jshintrc'
];

var fileHashes = [
  '8ebdb97de639e57bf6a6c3ff40635145',
  '35a47ba96ef7df7a02a56404c4789661',
  'ba8ce97943fd057f95bf9bd224f9b341',
  '959adea3ffb26c065688feebd625b0ba',
  'bf889f7352b3160da034f97b8f0ee302',
  'd41d8cd98f00b204e9800998ecf8427e',
  '959adea3ffb26c065688feebd625b0ba',
  'bf889f7352b3160da034f97b8f0ee302',
  'd41d8cd98f00b204e9800998ecf8427e',
  '9775689a3bb879b64e6a4145e2989865',
  'ace68224c8d78f0bf38627dea70fde48',
  '3f0637b5ad62e13600323b6cbc9dd6cb',
  'a5608261a0321c7bd64bcea70a4a1ed7',
  '8fc4a823f390ded3efe13f7715957236',
  '57c8e089acd7437c55280ec04792299d',
  'a30a55d17c507c18b32030ce5a4ecb0a',
  '5d64a6422671646b7023338cb6169179',
  'a63304dd55e11e8b20b88b66b36d2029',
  '6ff416f09faef493c60499b77d0aac80',
  '939e7d8b3378d47d80969abd30f4f604',
  'c1a27c726508768133e89f3775cc0698',
  'bd2ae06061aee8300ecde6babadc92c2',
  'c19281d4dc991cbb945f409e2ecbb81d',
  '9bc302f6f7073be88680cd6b6b6bee85',
  'c1fe22d6b50ce53b1f36884245dd28cb',
  'b86f3fee2cbc74f972e474378c6061ee',
  '8ebb66340c4edcc4e295fe7280f2e017',
  '8c1d2884f75b17182540be041b928e47',
  '5dbe2d8fa3e83c30fdeb97b217635bef',
  '410cd18a42d0d0dc56e7045351ee5072',
  '45fda0c924f94193200fa29a3a767b03',
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
      var data;
      for (var i = 0; i < expectedFiles.length; i++) {
        data = fs.readFileSync(path.join(__dirname, 'temp', expectedFiles[i]), 'utf8');
        // console.log(expectedFiles[i] + ',' + fileHashes[i] + ',' + md5(data));
        helpers.assertTextEqual(md5(data), fileHashes[i]);
      }

      done();
    });
  });
});
