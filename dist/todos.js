'use strict';

var _acorn_loose = require('acorn/dist/acorn_loose');

var acorn = _interopRequireWildcard(_acorn_loose);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _esprima = require('esprima');

var _esprima2 = _interopRequireDefault(_esprima);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _textTable = require('text-table');

var _textTable2 = _interopRequireDefault(_textTable);

var _shiftParser = require('shift-parser');

var _shiftParser2 = _interopRequireDefault(_shiftParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    var fileData = _fs2.default.readFileSync(file);
    var comments = [];
    var opts = Object.assign({
      onComment: comments
    }, esprimaOpts);
    acorn.parse_dammit(fileData, opts);
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
var filelist = args._;

if (args.o) {
  _chalk2.default.enabled = false;
}

if (args.debug) {
  debug = true;
}

var output = report(searchFiles.apply(undefined, _toConsumableArray(filelist)));

if (args.o) {
  _fs2.default.writeFileSync(args.o, output);
} else {
  process.stdout.write(output);
}
