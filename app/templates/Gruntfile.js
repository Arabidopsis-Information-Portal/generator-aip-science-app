/*global module:false*/
'use strict';
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var config = {
    appName: '<%= _.slugify(appname) %>',
    app: 'app',
    dist: 'dist'
  };

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: config,

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint']
      },
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      livereload: {
        files: [
          'index.html',
          'lib/*.*',
          '<%%= config.app %>/{,*/}*.html',
          '<%%= config.app %>/images/{,*/}*',
          '.tmp/styles/{,*/}*.css'
        ],
        tasks: ['includes'],
        options: {
          livereload: '<%%= connect.options.livereload %>'
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
      dist: {
        options: {
          hostname: '0.0.0.0',
          livereload: false,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/lib', connect.static('lib')),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/app', connect.static(config.app))
            ];
          }
        }
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/lib', connect.static('lib')),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/app', connect.static(config.app))
            ];
          }
        }
      },
    },

    // Empties folders to start fresh
    clean: {
      server: '.tmp',
      dist: {
        files: [{
          dot: true,
          src: ['.tmp', '<%%= config.dist %>/*', '!<%%= config.dist %>/.git*']
        }]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'lib/*.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
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

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      target: {
        src: [
          'index.html'
        ]
      }
    },

    copy: {
      libraries: {
        expand: true,
        cwd: '<%%= config.app %>/vendor',
        src: '**',
        dest: '.tmp/sites/all/libraries/<%%= config.appName %>/'
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
      return grunt.task.run([
        'clean:server',
        'jshint',
        'wiredep',
        'includes',
        'copy',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'jshint',
      'wiredep',
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
    'jshint',
    'wiredep',
    'inline'
  ]);

};
