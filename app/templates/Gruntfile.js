/*global module:false*/
'use strict';
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var config = {
    appName: '<%= appname %>',
    app: '<%= app %>',
    dist: '<%= dist %>'
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
        files: ['<%%= config.app %>/<%= scriptDir %>/{,*/}*.js'],
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
          '<%= config.app %>/<%= styleDir %>/{,*/}*.css',
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
              connect().use('/app', connect.static(config.app)),
              connect().use('/assets', connect.static('./assets'))
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
              connect().use('/app', connect.static(config.app)),
              connect().use('/assets', connect.static('./assets'))
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
        '<%%= config.app %>/<%= scriptDir %>/{,*/}*.js',
        '!<%%= config.app %>/<%= scriptDir %>/vendor/*',
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
    // don't include any transient jQuery dependencies
    wiredep: {
      target: {
        src: [
          'index.html'
        ],
        options: {
          exclude: [ /jquery\.js$/, /jquery\.min\.js$/ ]
        }
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
        src: ['app/<%= appHTML %>'],
        dest: [ 'dist/' ],
        options:{
          cssmin: true,
          uglify: true,
          tag: ''
        },
      }
    }
  });

/*
*   This task reads araport-app.json file and injects the necessary references
*   in the specified files. Its functionality is based on wiredep's functionality.
*   There could probably be a better solution out there, or maybe modify grunt-wiredep?
*/
  grunt.registerTask('araport-wiredep', '', function(){
    console.log('Wiring dependencies from araport-app.json');
    var $ = {
      _: require('lodash'),
      fs: require('fs'),
      path: require('path'),
    };
    //TODO relative path of assets, scripts and styles should only be app/ without the {styles, assets, scripts}
    var config = {
        'src': 'index.html',
        'appFile': 'araport-app.json',
        'fileTypes':{
            'js':{
                'depprop': 'scripts',
                'depcwd': 'app/',
                'replaceStr': '<script src="%filePath%"></script>'
            },
            'css':{
                'depprop': 'styles',
                'depcwd': 'app/',
                'replaceStr': '<link rel="stylesheet" href="%filePath%" />'
            },
            'html':{
                'depprop': 'html',
                'depcwd': '/app/',
                'replaceStr': 'include "%filePath%"'
            },
        },
        'block': /(([ \t]*)<!--\s*araport_dep:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endaraport_dep\s*-->)/gi
    };
    var error;
    //Check for the araport=app.json file and load it.
    if(!$.fs.existsSync(config.appFile)){
        error = new Error('Cannot find araport-app.json.');
        error.code = 'ARAPORT_COMPONENTS_MISSING';
        grunt.fail.warn(error);
    }
    var ajson = JSON.parse($.fs.readFileSync(config.appFile));
    //Check for the index.html file and load it.
    if(!$.fs.existsSync(config.src)){
        error = new Error('Cannot find src file');
        error.code = 'ARAPORT_COMPONENTS_MISSING';
        grunt.fail.warn(error);
    }
    var shtml = String($.fs.readFileSync(config.src));
    var filePath = config.src;
    //var fileExt = $.path.extname(filePath).substr(1);
    //Get the file types that are on the config json.
    var fileTypes = [];
    $._.forEach(config.fileTypes, function(n, key){
        fileTypes.push(key);
    });
    //function to get the array of file names to wire.
    var _getFileNames = function(fileType, config, ajson){
        var depprop = config.fileTypes[fileType].depprop;
        var ret = [];
        var tmpRet = ajson[depprop];
        if(tmpRet.constructor !== Array){
            ret.push(tmpRet);
        }else{
            ret = tmpRet;
        }
        return ret;
    };
    //function to append the relative path within the app to the files to wire.
    var _getRelPaths = function(fileType, config, ajson, fileNames){
        var depcwd = config.fileTypes[fileType].depcwd;
        var relPaths = [];
        $._(fileNames).forEach(function(n){
            relPaths.push(depcwd + n);
        }).value();
        return relPaths;
    };

    //Callback function when we find a block
    var _constructDeps = function(relPaths, config, fileType){
        var paths = relPaths;
        var cfg = config;
        var ft = fileType;
        return function(match, startBlock, spacing, blockType, oldScripts, endBlock, offset, string){
            var ret = '';
            if(blockType !== fileType){
                return match;
            }
            var deps = "";
            $._(paths).forEach(function(relPath){
                deps += cfg.fileTypes[ft].replaceStr.replace('%filePath%', relPath) + spacing;
            }).value();
            return startBlock + '\n' + spacing + deps + '\n' +  spacing + endBlock;
        };
    };
    var newCont = shtml;
    $._(fileTypes).forEach(function(n){
        console.log("for filetype: " + n);
        var fileNames = _getFileNames(n, config, ajson);
        var relPaths = _getRelPaths(n, config, ajson, fileNames);
        newCont = newCont.replace(config.block, _constructDeps(relPaths, config, n));
    }).value();
    if (newCont !== shtml){
        $.fs.writeFileSync(filePath, newCont);
    }
    return true; 
  });

  /*
   * Make sure that the bower_components dependency path exists
   * even if we have no external dependencies, otherwise
   * wiredep gets mad
   */
  grunt.registerTask('checkdeps', function() {
    var fs = require('fs');
    if (! fs.existsSync('bower_components')) {
      fs.mkdirSync('bower_components');
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'clean:server',
        'jshint',
        'checkdeps',
        'araport-wiredep',
        'wiredep',
        'includes',
        'copy',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'jshint',
      'checkdeps',
      'araport-wiredep',
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
    'checkdeps',
    'araport-wiredep',
    'wiredep',
    'inline'
  ]);

};
