import { ComparisonCell } from "@/components/blog/comparison"
import type { CompareGroup, Product } from "@/lib/compare"

// A comparison page's table, drawn from content/compare/competitors.json with the blog's
// comparison styles (.blog-comparison in app/globals.css): group rows, markers for yes and no, and
// Sniptide's column tinted because Sniptide publishes the page. Each cell carries its source in a
// tooltip, and the page lists every source below the table.
export function CompareTable({
  products,
  groups,
  caption,
}: {
  products: Product[]
  groups: CompareGroup[]
  caption: string
}) {
  return (
    <figure className="blog-comparison compare-pair" data-highlight={2}>
      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>
                <div className="blog-cell">
                  <span className="sr-only">Feature</span>
                </div>
              </th>
              {products.map((item) => (
                <th key={item.id} scope="col">
                  <div className="blog-cell">{item.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.flatMap((group) => [
              <tr key={group.label}>
                <td>
                  <div className="blog-cell">
                    <strong>{group.label}</strong>
                  </div>
                </td>
                {products.map((item) => (
                  <td key={item.id}>
                    <div className="blog-cell" />
                  </td>
                ))}
              </tr>,
              ...group.rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="blog-cell">{row.label}</div>
                  </td>
                  {row.cells.map((cell, index) => (
                    <td key={products[index]?.id ?? index} title={`Source: ${cell.sourceTitle}`}>
                      <div className="blog-cell">
                        <ComparisonCell>{cell.value}</ComparisonCell>
                      </div>
                    </td>
                  ))}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
      <figcaption className="mx-auto mt-3 max-w-[30rem] text-center text-[0.8125rem] leading-5 text-pretty text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}
