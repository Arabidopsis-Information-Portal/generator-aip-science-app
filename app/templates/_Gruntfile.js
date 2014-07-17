/*global module:false*/
'use strict';
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var config = {
    appName: 'package',
    app: 'app',
    dist: 'dist'
  };

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: config,

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint']
      },
      scripts: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      livereload: {
        files: [
          'index.html',
          '<%= config.app %>/{,*/}*.html',
          '<%= config.app %>/images/{,*/}*'
        ],
        tasks: ['includes'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static(config.app)
            ];
          }
        }
      },
    },

    // Empties folders to start fresh
    clean: {
      server: '.tmp',
      dist: 'dist'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    includes: {
      files: {
        src: ['index.html', 'app/*.html'], // Source files
        dest: '.tmp', // Destination directory
        flatten: true,
        cwd: '.',
        options: {
          silent: true,
        }
      }
    },

    copy: {
      libraries: {
        expand: true,
        cwd: '<%= config.app %>/vendor',
        src: '**',
        dest: '.tmp/sites/all/libraries/<%= config.appName %>/'
      }
    },

    inline: {
      dist: {
        src: ['app/app.html'],
        dest: [ 'dist/' ],
        options:{
          cssmin: true,
          uglify: true,
          tag: ''
        },
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includes',
      'copy',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('default', 'serve');

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'inline'
  ]);

};
