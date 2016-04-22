'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _esprimaFb = require('esprima-fb');

var _esprimaFb2 = _interopRequireDefault(_esprimaFb);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _textTable = require('text-table');

var _textTable2 = _interopRequireDefault(_textTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const colorMap = {
  NOTE: 'blue',
  TODO: 'yellow',
  FIXME: 'red'
};

const matcher = /(FIXME|TODO|NOTE)(\(([^\)]+)\))?:(.*)/;

const esprimaOpts = {
  comment: true,
  loc: true,
  sourceType: 'module'
};

function assignee(todo) {
  if (todo.assignee) {
    return _chalk2.default.magenta(` (${ todo.assignee })`);
  }
  return '';
}

function todos(data) {
  return data.map(todo => {
    const type = _chalk2.default[colorMap[todo.type]](`**${ todo.type }**`);
    const line = _chalk2.default.gray(`\`(line ${ todo.line })\``);
    return `-  [ ] ${ type } ${ line }${ assignee(todo) }: ${ todo.text }`;
  }).join('\n');
}

function files(data) {
  return Object.keys(data).map(file => {
    const todoText = todos(data[file]);
    return `## ${ file }\n\n${ todoText }`;
  }).join('\n\n');
}

function report(data) {
  const fileText = files(data);
  return _chalk2.default.gray(`# Project TODOs\n\n## TODO\n\n${ fileText }\n`);
}

function getTodo(comment) {
  const matches = comment.value.replace(/\n/g, ' ').match(matcher);
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

  return files.reduce((acc, file) => {
    const codePacket = _esprimaFb2.default.parse(_fs2.default.readFileSync(file), esprimaOpts);
    const comments = codePacket.comments;
    const todos = comments.map(comment => {
      return getTodo(comment);
    }).filter(match => !!match);
    if (todos.length > 0) {
      acc[file] = todos;
    }
    return acc;
  }, {});
}

const args = (0, _minimist2.default)(process.argv.splice(2), {});
const filelist = args._;

if (args.o) {
  _chalk2.default.enabled = false;
}

const output = report(searchFiles(...filelist));

if (args.o) {
  _fs2.default.writeFileSync(args.o, output);
} else {
  process.stdout.write(output);
}
