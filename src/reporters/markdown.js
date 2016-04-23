function assignee(todo) {
  if (todo.assignee) {
    return ` (${todo.assignee})`
  }
  return ''
}

function todos(data) {
  return data.map(todo => {
    const type = `**${todo.type}**`
    const line = `\`(line ${todo.line})\``
    return `-  [ ] ${type} ${line}${assignee(todo)}: ${todo.text}`
  }).join('\n')
}

function files(data) {
  return Object.keys(data).map(file => {
    const todoText = todos(data[file])
    return `## ${file}\n\n${todoText}`
  }).join('\n\n')
}

export default function report(data) {
  const fileText = files(data)
  return `# Project TODOs\n\n## TODO\n\n${fileText}\n`
}
