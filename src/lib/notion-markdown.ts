export function normalizeNotionMarkdown(markdown: string): string {
  // Notion uses one newline between blocks; Markdown needs a blank line around raw tables and headings.
  const lines = markdown.split(/\r?\n/)
  let inTable = false
  let inCodeFence = false
  const listItem = /^\s*(?:[-*+] |\d+[.)] )/

  return lines.map((line, index) => {
    const previous = lines[index - 1] ?? ''
    const sameBlock = inTable || inCodeFence || !line || !previous ||
      (listItem.test(previous) && listItem.test(line))
    const separator = index === 0 ? '' : sameBlock ? '\n' : '\n\n'

    if (/^\s*<table\b/i.test(line)) inTable = true
    if (/^\s*<\/table>/i.test(line)) inTable = false
    if (/^\s*(?:`{3,}|~{3,})/.test(line)) inCodeFence = !inCodeFence

    return separator + line
  }).join('')
}
