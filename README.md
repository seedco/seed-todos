# @seed/todos

## Getting Started

This package is intended to be used as an `npm` script inside your project's `package.json` file. After it is installed as a dependency, it makes available a `todos` command within your `npm` environment.

To install it:
```shell
npm install @seed/todos --save-dev
```

Once installed, you can add it to your `package.json` as follows:

```json
  "scripts": {
    "todos": "todos -o todos.md 'src/**/*.js' 'test/**/*.js'",
  }
```

Then whenever you run `npm run todos` in your project, it will walk the given path globs, parsing any files it sees using babylon (so it will use your `.babelrc` if present), and pull out any FIXME, TODO, or NOTE comments into a markdown file (in the above case, the ouput would go into `todos.md`).

### Why?

While there are several todo parsers on the market, none currently use babylon to parse the source, so those using advanced features of ES6/7 are left without many options. Other parsers tend to use `esprima` or `acorn` for parsing, or if they do not fully parse the source, they use regular expressions to match comments. There are many problems with these approaches, such as multi-line comments and static class properties. This package solves those problems by fully parsing your source using the same parser used to transpile it (assuming you are using Babel).

### Options

There's really only one option at this point: `-o <file>` to specify your output file. If not given, it will output to `stdout`. Any other arguments will be interpreted as path globs to search for files with.

## Contributing

There is currently no style guide or linting. I will fix that. Please keep it clean and follow the style of the existing code for the time being.
