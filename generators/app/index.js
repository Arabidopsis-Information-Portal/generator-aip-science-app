'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');


var ScienceAppGenerator = yeoman.Base.extend({

    initializing:{
        init: function(){
            this.sourceRoot(this.sourceRoot() + '/../../common/templates');
            this.pkg = require('../../package.json');
        }
    },

    prompting: function(){
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
        }];

        return this.prompt(prompts).then(function (props) {
          var config = {};
          config.scAppNameSlug = slugify(props.appName);
          config.scAppName = props.appName.length > 0 ? props.appName : 'Science App';
          config.scAppDesc = props.appDesc;
          config.scAppHTML = 'main.html';
          config.scAppScript = 'main.js';
          config.scAppScriptDir = 'scripts';
          config.scAppStyle = 'main.css';
          config.scAppStyleDir = 'styles';
          config.scAppStyleDir = this.scAppStyleDir;

          var libraries = props.libraries || [];

          function includeLib(lib) {
            return libraries.indexOf(lib) !== -1;
          }

          config.includeBioJS = includeLib('includeBioJS');
          config.includeCytoscape = includeLib('includeCytoscape');
          config.helloWorld = false;
          this.config = config;

          done();
        }.bind(this));
    },

    writing: {
        projectfiles: function () {
          this.copy('editorconfig', '.editorconfig');
          this.copy('gitignore', '.gitignore');
          this.copy('gitattributes', '.gitattributes');
          this.copy('jshintrc', '.jshintrc');
        },

        readme: function() {
            this.fs.copyTpl(this.templatePath('README.md'), 
                            this.destinationPath('README.md'), 
                            {appname: this.config.scAppNameSlug});
        },

        gruntfile: function () {
            this.fs.copyTpl(this.templatePath('Gruntfile.js'),
                          this.destinationPath('Gruntfile.js'),
                          {appname: this.config.scAppNameSlug, 
                            app: 'app', dist: 'dist',
                            scriptDir: this.config.scAppScriptDir,
                            styleDir: this.config.scAppStyleDir, 
                            appHTML: this.config.scAppHTML});
        },

        packageJSON: function() {
            this.fs.copyTpl(this.templatePath('package.json'),
                            this.destinationPath('package.json'),
                            {appname: this.config.scAppNameSlug});
        },
        app: function () {
            this.fs.copyTpl(this.templatePath('app/app.html'), 
                        this.destinationPath('app/' + this.config.scAppHTML),
                        {appname: this.config.scAppNameSlug});
            this.fs.copy(this.templatePath('app/styles/app.css'),
                        this.destinationPath('app/' + this.config.scAppStyleDir + '/' + this.config.scAppStyle));
            var example = this.config.helloWorld ? 'AIP.displayList(appContext, \'' + this.config.scAppNameSpace + '\', \'' + this.config.scAppService + '\', {});' : '';
            this.fs.copyTpl(this.templatePath('app/scripts/app.js'),
                        this.destinationPath('app/' + this.config.scAppScriptDir + '/' + this.config.scAppScript),
                        {appname: this.config.scAppName, 
                        appslug: this.config.scAppNameSlug,
                        example: example});
            this.fs.copy(this.templatePath('app/scripts/aip-helper.js'),
                        this.destinationPath('app/' + this.config.scAppScriptDir + '/aip-helper.js'));
        },

        testrunner: function() {
            this.fs.copyTpl(this.templatePath('index.html'), 
                            this.destinationPath('index.html'),
                            {appname: this.config.scAppName });
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
                name: this.config.scAppName,
                description: this.config.scAppDesc,
                icon: '',
                tags: [],
                html: this.config.scAppHTML,
                scripts: [this.config.scAppScriptDir + '/aip-helper.js', this.config.scAppScriptDir + '/' + this.config.scAppScript],
                styles: [this.config.scAppStyleDir + '/' + this.config.scAppStyle]
            };
            if(this.config.scAppNameSpace && this.config.scAppNameSpace.length > 0){
                araport.namespace = this.config.scAppNameSpace;
            }
            if(this.config.scAppService && this.config.scAppService.length > 0){
                araport.service = this.config.scAppService;
            }

            this.fs.write(this.destinationPath('araport-app.json'), JSON.stringify(araport, null, 2));
        },
        bower: function () {
            var bower = {
              name: this.config.scAppNameSlug,
              private: true,
              dependencies: {}
            };

            if (this.config.includeBioJS) {
            //jshint -W069
              bower.dependencies['biojs'] = 'biojs/biojs#v1.0';
            //jshint +W069
            }

            if (this.config.includeCytoscape) {
              bower.dependencies.cytoscape = 'cytoscape/cytoscape.js#~2.2.13';
            }

            this.fs.write(this.destinationPath('bower.json'), JSON.stringify(bower, null, 2));
        }
    }
});

module.exports = ScienceAppGenerator;
