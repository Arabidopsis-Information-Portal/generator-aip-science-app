'use strict';
var yeoman = require('yeoman-generator');
var slugify = require('underscore.string/slugify');
var yosay = require('yosay');

var ScienceAppGeneratorHW = yeoman.Base.extend({

    initializing:{
        init: function(){
            this.sourceRoot(this.sourceRoot() + '/../../common/templates');
            this.pkg = require('../../package.json');
        }
    },

    prompting: {
        askFor: function(){
            var done = this.async();

            // Have Yeoman greet the user.
            this.log(yosay('Welcome to the AIP Science App generator!'));

            var prompts = [
            {
              type: 'input',
              name: 'appName',
              message: 'How would you like to name your science app?'
            },
            {
              type: 'input',
              name: 'appDesc',
              message: 'Give a quick description of this science app.'
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
            }
            ];

            this.prompt(prompts, function (props) {
              var config = {};
              this.scAppNameSlug = slugify(props.appName);
              config.scAppNameSlug = this.scAppNameSlug;
              this.scAppName = props.appName.length > 0 ? props.appName : 'Science App';
              config.scAppName = this.scAppName;
              this.scAppDesc = props.appDesc;
              config.scAppDesc = this.scAppDesc;
              this.scAppHTML = 'main.html'; 
              config.scAppHTML = this.scAppHTML;
              this.scAppScript = 'main.js'; 
              config.scAppScript = this.scAppScript;
              this.scAppScriptDir = 'scripts'; 
              config.scAppScriptDir = this.scAppScriptDir;
              this.scAppStyle = 'main.css'; 
              config.scAppStyle = this.scAppStyle;
              this.scAppStyleDir = 'styles'; 
              config.scAppStyleDir = this.scAppStyleDir;

              var libraries = props.libraries;

              function includeLib(lib) {
                return libraries.indexOf(lib) !== -1;
              }
              
              this.scAppNameSpace = props.appNameSpace.length > 0 ? props.appNameSpace : '';
              config.scAppNameSpace = this.scAppNameSpace;
              this.scAppService = props.appService.length > 0 ? props.appService : '';
              config.scAppService = this.scAppService;

              this.includeBioJS = includeLib('includeBioJS');
              this.includeCytoscape = includeLib('includeCytoscape');
              config.includeBioJS = this.includeBioJS;
              config.includeCytoscape = this.includeCytoscape;
              this.subConfig = config;

              done();
            }.bind(this));
        }
    },

    default: {
        app: function () {
            this.subConfig.helloWorld = true;
            this.composeWith('aip-science-app:common', {options:{
                subConfig: this.subConfig
            }});
        },
    }

});

module.exports = ScienceAppGeneratorHW;
