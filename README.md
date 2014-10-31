# AIP Science App Generator [![Build Status](https://secure.travis-ci.org/Arabidopsis-Information-Portal/generator-aip-science-app.png?branch=master)](https://travis-ci.org/Arabidopsis-Information-Portal/generator-aip-science-app)

A [Yeoman](http://yeoman.io) generator for building Science Applications for
the [Arabidopsis Information Portal][aip]

![Arabidopsis Information Portal](https://www.araport.org/sites/all/themes/custom/araport-theme/images/AIP-logo.svg)

## Getting Started

To use the generator you'll need to have [Node.js and npm][node]
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

### Adding third-party libraries

Third-party libraries are managed by [Bower][bower]. Due to how we build AIP
science apps, libraries must use a valid bower.json and **must have `main`
defined in the bower.json**. This allows the apps environment to determine
dependencies at runtime.

You can search for bower packages [online](http://bower.io/search/) or using
the command line:

```bash
$ bower search <keyword>
```

To add a library:

```bash
$ bower install <package name> --save
```

Make sure that you include the `--save` so it's added to your application's
own bower.json. Otherwise, the build tools won't know it's been added!

To remove a library:

```base
$ bower uninstall <package name> --save
```

#### What about libraries not in the Bower registry?

Okay, okay, we know that not every library out there is going to have a bower
package. Not to worry, there is still hope!

For libraries that don't have a bower package (or have an incomplete one) there
are a couple of options:

1. If the bower package exists but `main` is missing, the best thing to do is
   probably to contact the maintainer and ask them to fix it. Submit a pull
   request!

2. Alternatively, you can fork the repo and add the `main` definition yourself.

3. Bower doesn't require that a bower package actually be registered. You can
   use bower to include any library available from a Git endpoint, e.g., Github.
   But you will still need a bower.json for the app build.

4. Fork the repository to your own Git repo and create a bower.json!


### Compatibility and Best Practices

#### HTML

1. Be careful using HTML IDs!

#### JavaScript

1. Use closures!

#### More

More coming soon!

### Packaging for deployment

Coming soon!

### Other

AIP Science Apps use [Grunt][grunt] for executing development tasks
and [Bower][bower] for library and dependency management.

## Release history

#### v0.2.7

- added [ADAMA API](https://github.com/Arabidopsis-Information-Portal/adama) spec
- integrated [mrhanlon/swagger-js/tree/feature/arbitrary-query-params](https://github.com/mrhanlon/swagger-js/tree/feature/arbitrary-query-params)
- updated fix for wiredep and missing `bower_components` directory

#### v0.2.6

- tests

#### v0.2.5

- client generation was not using jQuery in the SwaggerApi init
- properly URI encode values in token calls

#### v0.2.4

- fix issue with Gruntfile not being properly escaped
- create a bower_components dir even when no dependencies so that wiredep is happy

#### v0.2.3

- updated documentation
- fixed tests

#### v0.2.2

- Added serve:dist config
- Upgraded dependency handling to use wiredep
- removed CDN-served files from bower (bower should only be app dependencies, not env dependencies)
- Using Swagger Api using jQuery instead of Shred.js
- Added `/me` endpoint to profiles spec
- Updated files spec to include uploading a file directly
- Updated swagger.js with better support for uploading files
- include a README in the generated app

#### v0.2.0

- Breaking changes to dependency handling related to upcoming changes in apps environment
- added tests

#### v0.1.0

- Initial release

## License

MIT

[aip]: https://www.araport.org
[node]: http://www.nodejs.org
[bower]: http://bower.io
[grunt]: http://gruntjs.com
