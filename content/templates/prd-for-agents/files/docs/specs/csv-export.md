# CSV export for invoices

Status: Ready to build
Owner: Dana (product), Sam (engineering)
Updated: 2026-11-08

## Problem

Accountants ask for a spreadsheet of invoices every month. Today support exports it by hand from
the database, which takes about 20 minutes per request and arrives a day late.

## Goal

A signed-in user can download their invoices as a CSV file from the Invoices page, filtered the
same way as the list on screen.

Success: support export requests drop to zero within a month of release.

## Users and stories

- As an owner, I download last month's paid invoices so my accountant can reconcile them.
- As an accountant with read access, I export invoices for one customer without asking the owner.

## Requirements

1. An **Export CSV** button sits next to the filters on the Invoices page.
2. The file contains the invoices that match the current filters, in the list's order.
3. Columns, in this order: number, customer, issue date, due date, status, currency, amount.
4. Amounts are decimals with two places (19.99), dates are ISO 8601 (2026-11-08).
5. The file name is `invoices-YYYY-MM-DD.csv`, using the day of the export.
6. Exports of up to 10,000 rows download straight away. Larger exports show an error that asks
   the user to narrow the filters.
7. Users with read access can export. Nobody can export another workspace's invoices.

## Out of scope

- Excel or PDF formats.
- Scheduled or emailed exports.
- Exporting line items.

## Technical notes

- Add `GET /api/invoices/export` that takes the same query parameters as `GET /api/invoices`.
- Reuse `listInvoices` in `lib/invoices.ts` for filtering and permissions. Don't write a second
  query.
- Stream the response with `Content-Type: text/csv` and `Content-Disposition: attachment`.
- Escape fields per RFC 4180: quote fields that contain commas, quotes or line breaks.

## Acceptance criteria

- [ ] With the "Paid" and "October" filters set, the file holds exactly the invoices on screen.
- [ ] A customer named `Smith, "Jr" Ltd` opens correctly in Excel and Google Sheets.
- [ ] A user with read access can export; a signed-out request gets 401.
- [ ] A filter matching 10,001 invoices shows the error and downloads nothing.
- [ ] Tests cover the CSV escaping and the permission check.

## Open questions

- Should the export include voided invoices when no status filter is set? Current answer: yes,
  matching the list.
