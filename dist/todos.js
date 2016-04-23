'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _babylon = require('babylon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This is a comment
// FIXME: This is a fixme
// TODO: This is an unassigned todo
// TODO(john): This is an assigned todo
// NOTE: This is a note

/* TODO(verboseman): This is a multi-line todo. It is
soooooooo long!
So
so so
so
so
long!
It has a whole ton of stuff!
*/

var Test = function Test() {
  _classCallCheck(this, Test);
};

Test.testy = {};
// This tests semi-crazy es6 syntax


var colorMap = {
  NOTE: 'blue',
  TODO: 'yellow',
  FIXME: 'red'
};

var matcher = /(FIXME|TODO|NOTE)(\(([^\)]+)\))?:(.*)/;

var debug = false;

var esprimaOpts = {
  // comment: true,
  locations: true,
  sourceType: 'module'
  // tolerant: true
};

var parserOptions = {
  sourceType: 'module',
  plugins: ['flow', 'jsx', 'asyncFunctions', 'asyncGenerators', 'classConstructorCall', 'classProperties', 'decorators', 'doExpressions', 'exponentiationOperator', 'exportExtensions', 'functionBind', 'functionSent', 'objectRestSpread', 'trailingFunctionCommas']
};

function assignee(todo) {
  if (todo.assignee) {
    return _chalk2.default.magenta(' (' + todo.assignee + ')');
  }
  return '';
}

function todos(data) {
  return data.map(function (todo) {
    var type = _chalk2.default[colorMap[todo.type]]('**' + todo.type + '**');
    var line = _chalk2.default.gray('`(line ' + todo.line + ')`');
    return '-  [ ] ' + type + ' ' + line + assignee(todo) + ': ' + todo.text;
  }).join('\n');
}

function files(data) {
  return Object.keys(data).map(function (file) {
    var todoText = todos(data[file]);
    return '## ' + file + '\n\n' + todoText;
  }).join('\n\n');
}

function report(data) {
  var fileText = files(data);
  return _chalk2.default.gray('# Project TODOs\n\n## TODO\n\n' + fileText + '\n');
}

function getTodo(comment) {
  var matches = comment.value.replace(/\n/g, ' ').match(matcher);
  if (matches) {
    return {
      type: matches[1],
      assignee: matches[3],
      text: matches[4],
      line: comment.loc.start.line
    };
  }
}

function searchFiles() {
  for (var _len = arguments.length, files = Array(_len), _key = 0; _key < _len; _key++) {
    files[_key] = arguments[_key];
  }

  return files.reduce(function (acc, file) {
    if (debug) {
      console.log(file);
    }
    var fileData = _fs2.default.readFileSync(file, { encoding: 'utf8' });
    var parsed = (0, _babylon.parse)(fileData, parserOptions);
    var comments = parsed.comments;
    var todos = comments.map(function (comment) {
      return getTodo(comment);
    }).filter(function (match) {
      return !!match;
    });
    if (todos.length > 0) {
      acc[file] = todos;
    }
    return acc;
  }, {});
}

var args = (0, _minimist2.default)(process.argv.splice(2), {});
var filelist = args._.reduce(function (prev, pattern) {
  return prev.concat(_glob2.default.sync(pattern));
}, []);

if (args.o) {
  _chalk2.default.enabled = false;
}

if (args.debug) {
  debug = true;
}

if (debug) {
  console.log(args);
  console.log(filelist);
}

var output = report(searchFiles.apply(undefined, _toConsumableArray(filelist)));

if (args.o) {
  _fs2.default.writeFileSync(args.o, output);
} else {
  process.stdout.write(output);
}
