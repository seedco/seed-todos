import chalk from 'chalk'
import table from 'text-table'

const colorMap = {
  NOTE: 'blue',
  TODO: 'yellow',
  FIXME: 'red'
}

function assignee(todo) {
  return chalk.magenta(todo.assignee || ' ')
}

function todos(data) {
  const rows = data.map(todo => {
    return [
      '',
      `line ${todo.line}`,
      chalk[colorMap[todo.type]](todo.type),
      assignee(todo),
      todo.text
    ]
  }, {
    align: [
      'l',
      'l',
      'l',
      'r',
      'l'
    ]
  })
  return table(rows)
}

function files(data) {
  return Object.keys(data).map(file => {
    const todoText = todos(data[file])
    return `${chalk.white(file)}\n${todoText}`
  }).join('\n\n')
}

export default function report(data) {
  const fileText = files(data)
  return chalk.gray(`# Project TODOs\n\n## TODO\n\n${fileText}\n`)
}
