import * as acorn from 'acorn/dist/acorn_loose'

import chalk from 'chalk'
import esprima from 'esprima'
import fs from 'fs'
import minimist from 'minimist'
import textTable from 'text-table'
import shift, { parseModule } from 'shift-parser'

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

class Test {
  static testy = {} // This tests semi-crazy es6 syntax
}

const colorMap = {
  NOTE: 'blue',
  TODO: 'yellow',
  FIXME: 'red'
}

const matcher = /(FIXME|TODO|NOTE)(\(([^\)]+)\))?:(.*)/

let debug = false

const esprimaOpts = {
  // comment: true,
  locations: true,
  sourceType: 'module'
  // tolerant: true
}

function assignee(todo) {
  if (todo.assignee) {
    return chalk.magenta(` (${todo.assignee})`)
  }
  return ''
}

function todos(data) {
  return data.map(todo => {
    const type = chalk[colorMap[todo.type]](`**${todo.type}**`)
    const line = chalk.gray(`\`(line ${todo.line})\``)
    return `-  [ ] ${type} ${line}${assignee(todo)}: ${todo.text}`
  }).join('\n')
}

function files(data) {
  return Object.keys(data).map(file => {
    const todoText = todos(data[file])
    return `## ${file}\n\n${todoText}`
  }).join('\n\n')
}

function report(data) {
  const fileText = files(data)
  return chalk.gray(`# Project TODOs\n\n## TODO\n\n${fileText}\n`)
}

function getTodo(comment) {
  const matches = comment.value.replace(/\n/g, ' ').match(matcher)
  if (matches) {
    return {
      type: matches[1],
      assignee: matches[3],
      text: matches[4],
      line: comment.loc.start.line
    }
  }
}

function searchFiles(...files) {
  return files.reduce((acc, file) => {
    if (debug) {
      console.log(file)
    }
    const fileData = fs.readFileSync(file)
    const comments = []
    const opts = Object.assign({
      onComment: comments
    }, esprimaOpts)
    acorn.parse_dammit(fileData, opts)
    const todos = comments.map(comment => {
      return getTodo(comment)
    }).filter(match => !!match)
    if (todos.length > 0) {
      acc[file] = todos
    }
    return acc
  }, {})
}

const args = minimist(process.argv.splice(2), {})
const filelist = args._

if (args.o) {
  chalk.enabled = false
}

if (args.debug) {
  debug = true
}

const output = report(
  searchFiles(
    ...filelist
  )
)

if (args.o) {
  fs.writeFileSync(args.o, output)
} else {
  process.stdout.write(output)
}
