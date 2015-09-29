'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var slugify = require('underscore.string/slugify');


var ScienceAppGenerator = yeoman.Base.extend({

    initializing:{
        init: function(){
            this.pkg = require('../package.json');
            this.log('template path: ' + this.sourceRoot());
            this.log('destination path: ' + this.destinationRoot());
            this.log('appname: ' + this.appname);
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
                  var regexp = /^[^0-9a-zA-Z\-_\.]*$/;
                  return str.search(regexp) < 0 ? true : false;
              }
            },
            {
              type: 'input',
              name: 'appService',
              message: 'Which service are you going to use?',
              validate:function(str){
                  var regexp = /^[^0-9a-zA-Z\-_\.]*$/;
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
              type: 'input',
              name: 'appStyleDir',
              message: 'Where do you want to keep your stylesheets?',
              default: 'styles'
            },
            {
              type: 'input',
              name: 'appScriptDir',
              message: 'Where do you want to keep your scripts?',
              default: 'scripts'
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
              this.scAppNameSlug = slugify(props.appName);
              this.scAppName = props.appName.length > 0 ? props.appName : 'Science App';
              this.scAppNameSpace = props.appNameSpace.length > 0 ? props.appNameSpace : '';
              this.scAppService = props.appService.length > 0 ? props.appService : '';
              this.scAppDesc = props.appDesc;
              this.scAppHTML = props.appHTML.length > 0 ? props.appHTML : this.scAppNameSlug;
              this.scAppScript = props.appScript.length > 0 ? props.appScript : this.scAppNameSlug;
              this.scAppScriptDir = props.appScriptDir.length > 0 ? props.appScriptDir : 'scripts';
              this.scAppStyle = props.appStyle.length > 0 ? props.appStyle : this.scAppNameSlug;
              this.scAppStyleDir = props.appStyleDir.length > 0 ? props.appStyleDir : 'style';


              if(this.scAppHTML.lastIndexOf('.') === -1 || 
                  this.scAppHTML.substring(this.scAppHTML.lastIndexOf('.'), 
                  this.scAppHTML.length) !== '.html'){

                  this.scAppHTML += '.html';
              }
              if(this.scAppScript.lastIndexOf('.') === -1 ||
                  this.scAppScript.substring(this.scAppScript.lastIndexOf('.'), 
                  this.scAppScript.length) !== '.js'){

                  this.scAppScript += '.js';
              }
              if(this.scAppStyle.lastIndexOf('.') === -1 || 
                  this.scAppStyle.substring(this.scAppStyle.lastIndexOf('.'), 
                  this.scAppStyle.length) !== '.css'){

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
            this.fs.copyTpl(this.templatePath('README.md'), 
                            this.destinationPath('README.md'), 
                            {appname: this.scAppNameSlug});
        },

        gruntfile: function () {
            this.fs.copyTpl(this.templatePath('Gruntfile.js'),
                          this.destinationPath('Gruntfile.js'),
                          {appname: this.scAppNameSlug, 
                            app: 'app', dist: 'dist',
                            scriptDir: this.scAppScriptDir,
                            styleDir: this.scAppStyleDir, 
                            appHTML: this.scAppHTML});
        },

        packageJSON: function() {
            this.fs.copyTpl(this.templatePath('package.json'),
                            this.destinationPath('package.json'),
                            {appname: this.scAppNameSlug});
        },
        app: function () {
            this.fs.copyTpl(this.templatePath('app/app.html'), 
                        this.destinationPath('app/' + this.scAppHTML),
                        {appname: this.scAppNameSlug});
            this.fs.copy(this.templatePath('app/styles/app.css'),
                        this.destinationPath('app/' + this.scAppStyleDir + '/' + this.scAppStyle));
            this.fs.copyTpl(this.templatePath('app/scripts/app.js'),
                        this.destinationPath('app/' + this.scAppScriptDir + '/' + this.scAppScript),
                        {appname: this.scAppName, appslug: this.scAppNameSlug});
            this.fs.copy(this.templatePath('app/scripts/aip-helper.js'),
                        this.destinationPath('app/' + this.scAppScriptDir + '/aip-helper.js'));
        },

        testrunner: function() {
            this.fs.copyTpl(this.templatePath('index.html'), 
                            this.destinationPath('index.html'),
                            {appname: this.scAppName });
            this.fs.copy(this.templatePath('lib/*'),
                        this.destinationPath('lib/'));

            this.fs.copy(this.templatePath('lib/resources/**'),
                        this.destinationPath('lib/resources/'), {globOptions: {ignore: this.templatePath('lib/resources/index.json')}});
            this.fs.copy(this.templatePath('lib/swagger/*'),
                        this.destinationPath('lib/swagger/'));
        }
    },

    install: {
        araport:function(){
            var araport = {
                namespace: this.scAppNameSpace,
                name: this.scAppName,
                description: this.scAppDesc,
                html: this.scAppHTML,
                scripts: [this.scAppScriptDir + '/aip-helper.js', this.scAppScriptDir + '/' + this.scAppScript],
                styles: [this.scAppStyleDir + '/' + this.scAppStyle]
            };
            this.fs.write(this.destinationPath('araport-app.json'), JSON.stringify(araport, null, 2));
        },
        bower: function () {
            var bower = {
              name: this.scAppNameSlug,
              private: true,
              dependencies: {}
            };

            if (this.includeBioJS) {
              bower.dependencies['biojs'] = 'biojs/biojs#v1.0';
            }

            if (this.includeCytoscape) {
              bower.dependencies.cytoscape = 'cytoscape/cytoscape.js#~2.2.13';
            }

            this.fs.write(this.destinationPath('bower.json'), JSON.stringify(bower, null, 2));
        },
        swagger: function(){
            var swaggerIndex = this.fs.readJSON(this.templatePath('lib/resources/index.json'));
            swaggerIndex.basePath = '/lib/resources';
            this.fs.writeJSON(this.destinationPath('lib/resources/index.json'), swaggerIndex, null, 2);
        }
    }
});

module.exports = ScienceAppGenerator;
