'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = report;
function assignee(todo) {
  if (todo.assignee) {
    return ' (' + todo.assignee + ')';
  }
  return '';
}

function todos(data) {
  return data.map(function (todo) {
    var type = '**' + todo.type + '**';
    var line = '`(line ' + todo.line + ')`';
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
  return '# Project TODOs\n\n## TODO\n\n' + fileText + '\n';
}