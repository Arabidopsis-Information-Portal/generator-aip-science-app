# AIP Science App Generator [![Build Status](https://secure.travis-ci.org/mrhanlon/generator-aip-science-app.png?branch=master)](https://travis-ci.org/mrhanlon/generator-aip-science-app)

A [Yeoman](http://yeoman.io) generator for building Science Applications for
the [Arabidopsis Information Portal](https://www.araport.org).

![Arabidopsis Information Portal](https://www.araport.org/sites/all/themes/custom/araport-theme/images/AIP-logo.svg)

## Getting Started

To use the generator you'll need to have [Node.js and npm](http://www.nodejs.org)
installed. Install Yeoman and the app generator from npm using:

```bash
$ npm install -g yo generator-aip-science-app
```

Then, to create a science app in the current directory, initiate the generator:

```bash
$ yo aip-science-app
```

Your application code is in the `app/` directory inside the generated
application:

```
.
+-- app/
|   +-- app.html
|   +-- scripts/
|       +-- app.js
|   +-- styles/
|       +-- app.css

```

The main application HTML file is `app.html`. You can customize this file
to control how your application looks. You can add custom CSS styles in
`styles/app.css`. Finally, your application logic should be in
`scripts/app.js`.

## Next Steps

The generated application includes a "test runner" that provides a similar,
albeit stripped down environment as the main AIP apps page. This allows you
to easily develop your science app on your local development machine before
needing to deploy it to the AIP application workspace.

You can run the test runner application with the command:

```bash
$ grunt
```

This will build your application and start a server on
[http://localhost:9000](http://localhost:9000). It will also watch your
application source files for changes and automatically reload the browser when
changes are saved.

### Including third party dependencies

Coming soon!

### Packaging for deployment

Coming soon!

### Other

AIP Science Apps use [Grunt](http://gruntjs.com) for executing development tasks
and [Bower](http://bower.io) for library and dependency management.

## License

MIT
