'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = report;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _textTable = require('text-table');

var _textTable2 = _interopRequireDefault(_textTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorMap = {
  NOTE: 'blue',
  TODO: 'yellow',
  FIXME: 'red'
};

function assignee(todo) {
  return _chalk2.default.magenta(todo.assignee || ' ');
}

function todos(data) {
  var rows = data.map(function (todo) {
    return ['', 'line ' + todo.line, _chalk2.default[colorMap[todo.type]](todo.type), assignee(todo), todo.text];
  }, {
    align: ['l', 'l', 'l', 'r', 'l']
  });
  console.log(rows);
  return (0, _textTable2.default)(rows);
}

function files(data) {
  return Object.keys(data).map(function (file) {
    var todoText = todos(data[file]);
    return _chalk2.default.white(file) + '\n' + todoText;
  }).join('\n\n');
}

function report(data) {
  var fileText = files(data);
  return _chalk2.default.gray('# Project TODOs\n\n## TODO\n\n' + fileText + '\n');
}