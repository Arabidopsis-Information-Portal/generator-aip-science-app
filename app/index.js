'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var ScienceAppGenerator = yeoman.Base.extend({

    initializing:{
        init: function(){
            this.pkg = require('../package.json');
        }
    },

    prompting: {
        askFor: function(){
            var done = this.async();

            // Have Yeoman greet the user.
            this.log(yosay('Welcome to the AIP Science App generator!'));

            var prompts = [{
              type: 'input',
              name: 'appName',
              message: 'How would you like to name your science app?'
            },
            {
              type: 'input',
              name: 'appNameSpace',
              message: 'What\'s the name space for this science app?',
              validate:function(str){
                  regexp = /^[^0-9a-zA-Z\-_\.]$/;
                  return str.search(regexp) < 0 ? true : false;
              }
            },
            {
              type: 'input',
              name: 'appDesc',
              message: 'Give a quick description of this science app.'
            },
            {
              type: 'input',
              name: 'appHTML',
              message: 'How would you like to name the main HTML file?',
              default: 'main.html'
            },
            {
              type: 'input',
              name: 'appScript',
              message: 'What about the main js file? (You can add more later).',
              default: 'main.js'
            },
            {
              type: 'input',
              name: 'appStyle',
              message: 'And the main css file? (You can add more later).',
              default: 'main.css'
            },
            {
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
              this.scAppName = props.appName.length > 0 ? props.appName : 'Science App';
              this.scAppNameSpace = props.appNameSpace.length > 0 ? props.appName : 'my-app';
              this.scAppDesc = props.appDesc;
              this.scAppHTML = props.appHTML.length > 0 ? props.appHTML : this.scAppNameSpace + '.html';
              this.scAppScript = props.appScript.length > 0 ? props.appScript : this.scAppNameSpace + '.js';
              this.scAppStyle = props.appStyle.length > 0 ? props.appStyle : this.scAppNameSpace + '.css';
              if(this.scAppHTML.lastIndexOf('.') === -1 || 
                  this.scAppHTML.substring(this.scAppHTML.lastIndexOf('.'), 
                  this.scAppHTML) !== '.html'){

                  this.scAppHTML += '.html';
              }
              if(this.scAppScript.lastIndexOf('.') ===-1 || 
                  this.scAppScript.substring(this.scAppScript.lastIndexOf('.'), 
                  this.scAppScript) !== '.js'){

                  this.scAppScript += '.js';
              }
              if(this.scAppStyle.lastIndexOf('.') === -1 || 
                  this.scAppStyle.substring(this.scAppStyle.lastIndexOf('.'), 
                  this.scAppStyle) !== '.css'){

                  this.scAppStyle += '.css';
              }
              var libraries = props.libraries;

              function includeLib(lib) {
                return libraries.indexOf(lib) !== -1;
              }

              this.includeBioJS = includeLib('includeBioJS');
              this.includeCytoscape = includeLib('includeCytoscape');

              done();
            }.bind(this));
        }
    },

    configuring: {
        projectfiles: function () {
          this.copy('editorconfig', '.editorconfig');
          this.copy('gitignore', '.gitignore');
          this.copy('gitattributes', '.gitattributes');
          this.copy('jshintrc', '.jshintrc');
        }
    },

    default: {
        readme: function() {
            this.template('README.md');
        },

        gruntfile: function () {
            this.template('Gruntfile.js');
        },

        packageJSON: function() {
            this.template('package.json');
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
        }
    },

    install: {
        bower: function () {
            var bower = {
              name: this._.slugify(this.appname),
              private: true,
              dependencies: {}
            };

            if (this.includeBioJS) {
              bower.dependencies['biojs'] = 'biojs/biojs#v1.0';
            }

            if (this.includeCytoscape) {
              bower.dependencies.cytoscape = 'cytoscape/cytoscape.js#~2.2.13';
            }

            this.write('bower.json', JSON.stringify(bower, null, 2));
         
        }
    }
});

module.exports = ScienceAppGenerator;
