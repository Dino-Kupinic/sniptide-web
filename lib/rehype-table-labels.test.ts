import { describe, expect, test } from "bun:test"
import type { Element, Root } from "hast"
import { rehypeTableLabels } from "@/lib/rehype-table-labels"

const text = (value: string) => ({ type: "text" as const, value })
const el = (tagName: string, children: Element["children"] = []): Element => ({
  type: "element",
  tagName,
  properties: {},
  children,
})

function table(): Root {
  return {
    type: "root",
    children: [
      el("table", [
        el("thead", [
          el("tr", [
            el("th", [text("Where "), el("code", [text("PORT")]), text(" is set")]),
            el("th", [text("Container gets")]),
            el("th"),
          ]),
        ]),
        el("tbody", [
          el("tr", [
            el("td", [text("Image only")]),
            el("td", [text("5000")]),
            el("td", [text("x")]),
          ]),
        ]),
      ]),
    ],
  }
}

describe("rehypeTableLabels", () => {
  test("labels each body cell with its column header text", () => {
    const tree = table()
    rehypeTableLabels()(tree)
    const body = (tree.children[0] as Element).children[1] as Element
    const row = body.children[0] as Element
    const labels = (row.children as Element[]).map((cell) => cell.properties.dataLabel)
    expect(labels).toEqual(["Where PORT is set", "Container gets", undefined])
  })

  test("sets ARIA table roles so the stacked layout keeps its semantics", () => {
    const tree = table()
    rehypeTableLabels()(tree)
    const tableEl = tree.children[0] as Element
    const head = tableEl.children[0] as Element
    expect(tableEl.properties.role).toBe("table")
    expect(head.properties.role).toBe("rowgroup")
    expect((head.children[0] as Element).properties.role).toBe("row")
    expect(((head.children[0] as Element).children[0] as Element).properties.role).toBe(
      "columnheader",
    )
  })
})
