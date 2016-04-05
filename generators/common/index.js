'use strict';
var yeoman = require('yeoman-generator');


var ScienceAppGenerator = yeoman.Base.extend({

    initializing:{
        init: function(){
            this.pkg = require('../../package.json');
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
                            {appname: this.options.subConfig.scAppNameSlug});
        },

        gruntfile: function () {
            this.fs.copyTpl(this.templatePath('Gruntfile.js'),
                          this.destinationPath('Gruntfile.js'),
                          {appname: this.options.subConfig.scAppNameSlug, 
                            app: 'app', dist: 'dist',
                            scriptDir: this.options.subConfig.scAppScriptDir,
                            styleDir: this.options.subConfig.scAppStyleDir, 
                            appHTML: this.options.subConfig.scAppHTML});
        },

        packageJSON: function() {
            this.fs.copyTpl(this.templatePath('package.json'),
                            this.destinationPath('package.json'),
                            {appname: this.options.subConfig.scAppNameSlug});
        },
        app: function () {
            this.fs.copyTpl(this.templatePath('app/app.html'), 
                        this.destinationPath('app/' + this.options.subConfig.scAppHTML),
                        {appname: this.options.subConfig.scAppNameSlug});
            this.fs.copy(this.templatePath('app/styles/app.css'),
                        this.destinationPath('app/' + this.options.subConfig.scAppStyleDir + '/' + this.options.subConfig.scAppStyle));
            var example = this.options.subConfig.helloWorld ? 'AIP.displayList(appContext, \'' + this.options.subConfig.scAppNameSpace + '\', \'' + this.options.subConfig.scAppService + '\', {});' : '';
            this.fs.copyTpl(this.templatePath('app/scripts/app.js'),
                        this.destinationPath('app/' + this.options.subConfig.scAppScriptDir + '/' + this.options.subConfig.scAppScript),
                        {appname: this.options.subConfig.scAppName, 
                        appslug: this.options.subConfig.scAppNameSlug,
                        example: example});
            this.fs.copy(this.templatePath('app/scripts/aip-helper.js'),
                        this.destinationPath('app/' + this.options.subConfig.scAppScriptDir + '/aip-helper.js'));
        },

        testrunner: function() {
            this.fs.copyTpl(this.templatePath('index.html'), 
                            this.destinationPath('index.html'),
                            {appname: this.options.subConfig.scAppName });
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
                name: this.options.subConfig.scAppName,
                description: this.options.subConfig.scAppDesc,
                icon: '',
                tags: [],
                html: this.options.subConfig.scAppHTML,
                scripts: [this.options.subConfig.scAppScriptDir + '/aip-helper.js', this.options.subConfig.scAppScriptDir + '/' + this.options.subConfig.scAppScript],
                styles: [this.options.subConfig.scAppStyleDir + '/' + this.options.subConfig.scAppStyle]
            };
            if(this.options.subConfig.scAppNameSpace && this.options.subConfig.scAppNameSpace.length > 0){
                araport.namespace = this.options.subConfig.scAppNameSpace;
            }
            if(this.options.subConfig.scAppService && this.options.subConfig.scAppService.length > 0){
                araport.service = this.options.subConfig.scAppService;
            }

            this.fs.write(this.destinationPath('araport-app.json'), JSON.stringify(araport, null, 2));
        },
        bower: function () {
            var bower = {
              name: this.options.subConfig.scAppNameSlug,
              private: true,
              dependencies: {}
            };

            if (this.options.subConfig.includeBioJS) {
            //jshint -W069
              bower.dependencies['biojs'] = 'biojs/biojs#v1.0';
            //jshint +W069
            }

            if (this.options.subConfig.includeCytoscape) {
              bower.dependencies.cytoscape = 'cytoscape/cytoscape.js#~2.2.13';
            }

            this.fs.write(this.destinationPath('bower.json'), JSON.stringify(bower, null, 2));
        }
    }
});

module.exports = ScienceAppGenerator;
