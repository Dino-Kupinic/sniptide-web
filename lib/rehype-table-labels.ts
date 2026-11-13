import type { Element, ElementContent, Root, RootContent } from "hast"

// Gives every body cell of a Markdown table the text of its column header as `data-label`. On
// phones a blog table stacks each row into a block and shows that label next to the value
// (.blog-table in app/globals.css), so a reader never scrolls sideways to see what a value means.
// The stacked layout drops the table display, so the plugin also sets the ARIA table roles, which
// keep screen readers announcing rows and columns.
export function rehypeTableLabels() {
  return (tree: Root) => {
    for (const table of findElements(tree, "table")) labelTable(table)
  }
}

const roles: Record<string, string> = {
  thead: "rowgroup",
  tbody: "rowgroup",
  tr: "row",
  th: "columnheader",
  td: "cell",
}

function labelTable(table: Element) {
  table.properties.role = "table"
  for (const [tag, role] of Object.entries(roles)) {
    for (const element of findElements(table, tag)) element.properties.role = role
  }
  const headerRow = findElements(table, "thead").flatMap((head) => findElements(head, "tr"))[0]
  if (!headerRow) return
  const labels = cellsOf(headerRow).map((cell) => textOf(cell).trim())
  for (const body of findElements(table, "tbody")) {
    for (const row of findElements(body, "tr")) {
      cellsOf(row).forEach((cell, index) => {
        const label = labels[index]
        if (label) cell.properties.dataLabel = label
      })
    }
  }
}

function cellsOf(row: Element): Element[] {
  return row.children.filter(
    (child): child is Element =>
      child.type === "element" && (child.tagName === "th" || child.tagName === "td"),
  )
}

function findElements(node: Root | Element, tagName: string): Element[] {
  const found: Element[] = []
  const walk = (children: (RootContent | ElementContent)[]) => {
    for (const child of children) {
      if (child.type !== "element") continue
      if (child.tagName === tagName) found.push(child)
      walk(child.children)
    }
  }
  walk(node.children)
  return found
}

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value
  if (node.type === "element") return node.children.map(textOf).join("")
  return ""
}
