# <%= appname %>

An [AIP](http://www.araport.org) Science App created using [Yeoman](http://yeoman.io)
and the [AIP science app generator](https://www.npmjs.org/package/generator-aip-science-app).

## App Code

Your application code is in the `app/` subdirectory:

```
.
+-- app/
|   +-- app.html
|   +-- scripts/
|       +-- app.js
|   +-- styles/
|       +-- app.css

```

## Development

You can interactively develop your app using the built-in test runner. Simply
execute this command from within the base directory of your app:

```bash
$ grunt
```

This will run your application on a local server at
[http://localhost:9000](http://localhost:9000). It will also watch your
app code for changes and automatically reload the browser when it detects
changes.

You can also run the test runner app in "production" mode with the command:

```bash
$ grunt serve:dist
```

This will start the same server, but without source code monitoring (live reload)
and will also permit connections from outside, for example if you wanted to host
the app yourself on a publicly accessible server.

## Deployment

When you are ready you can upload your application to the
[AIP Science Apps Workspace](http://www.araport.org/apps).

** More details coming soon! **
