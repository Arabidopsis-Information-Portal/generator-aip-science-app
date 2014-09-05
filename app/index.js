'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var ScienceAppGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the AIP Science App generator!'));

    var prompts = [{
      type: 'checkbox',
      name: 'libraries',
      message: 'Would you like to use any of the following libraries?',
      choices: [{
        name: 'BioJS',
        value: 'includeBioJS',
        check: 'false'
      }, {
        name: 'Cytoscape.js',
        value: 'includeCytoscape',
        check: 'false'
      }]
    }];

    this.prompt(prompts, function (props) {
      var libraries = props.libraries;

      function includeLib(lib) {
        return libraries.indexOf(lib) !== -1;
      }

      this.includeBioJS = includeLib('includeBioJS');
      this.includeCytoscape = includeLib('includeCytoscape');

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  packageJSON: function() {
    this.template('package.json');
  },

  bower: function () {
    var bower = {
      name: this._.slugify(this.appname),
      private: true,
      dependencies: {}
    };

    /* AIP Science App Environment */
    bower.dependencies.jquery = "~1.11.1";
    bower.dependencies.bootstrap = '~3.1.1';
    bower.dependencies.fontawesome = '~4.1.0';

    /* for the Agave API */
    bower.dependencies['swagger-js'] = 'wordnik/swagger-js#~2.0.38'

    if (this.includeBioJS) {
      bower.dependencies['biojs'] = "biojs/biojs#v1.0";
    }

    if (this.includeCytoscape) {
      bower.dependencies.cytoscape = "cytoscape/cytoscape.js#~2.2.13";
    }

    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  app: function () {
    this.directory('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.template('app/app.html');
    this.template('app/scripts/app.js');
    this.copy('app/styles/app.css');
  },

  testrunner: function() {
    this.template('index.html');
    this.directory('lib');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = ScienceAppGenerator;
