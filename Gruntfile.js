/*global module:false*/
'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-release');
  grunt.initConfig({
    release: {
      options: {
        npmtag: true,
        tagName: 'v<%= version %>'
      }
    }
  });
};
