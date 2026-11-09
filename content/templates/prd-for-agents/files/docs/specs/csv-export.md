# Export filtered invoices to CSV

<!-- Fictional example. Replace the requirements, metrics and code references for your project. -->

Status: Ready for implementation
Owner: Product and billing engineering
Updated: 2026-11-09

## Problem

Accountants need to reconcile paid invoices each month. Support prepares their exports by hand,
and the person requesting an export waits for a reply.

## Goal

People with invoice read access can export the same filtered set they see on the Invoices page.

Success measure: compare monthly support requests for manual invoice exports for the 30 days
before and after launch. Record the baseline before release.

## Requirements

1. Show **Export CSV** next to the invoice filters for users with invoice read access.
2. Export every matching row in the current workspace across all pages, using the list's filters
   and sort order. When no rows match, return only the header.
3. Write UTF-8 CSV with columns `number,customer,issue_date,due_date,status,currency,amount`.
   Use ISO dates (`YYYY-MM-DD`), ISO 4217 currency codes and decimal amounts with the currency's
   usual number of fraction digits. Leave missing due dates empty.
4. Use the filename `invoices-YYYY-MM-DD.csv`, based on the export date in UTC.
5. Export up to 10,000 rows. At 10,001 matches or more, show “Too many invoices. Narrow your filters
   and try again.” Return no partial file.
6. Require a signed-in user with invoice read access in the requested workspace. Reject
   signed-out requests with 401 and deny users without access with 403.

## Out of scope

- Scheduled exports and export by email.
- Excel workbooks, PDFs and invoice line items.

## Technical notes

- Add `GET /api/invoices/export` with the list endpoint's filter and sort parameters.
- Reuse the workspace authorization and filters from `lib/invoices.ts`. Query up to 10,001
  matching rows and check the limit before starting the download.
- Send `Content-Type: text/csv; charset=utf-8`, an attachment filename and `Cache-Control: no-store`.
  Escape commas, quotes and line breaks with CSV quoting. Double embedded double quotes.
- Treat user-controlled text as text when opened in a spreadsheet. Use the project's CSV
  injection protection, or agree on the behavior before implementing the exporter.

## Acceptance criteria

- [ ] A paid-invoices filter with 51 matching rows exports all 51 in list order, including the
      row on page 2. Rows from another workspace are excluded.
- [ ] No matches returns the header alone. A name containing a comma and quotes parses as one
      field, and a formula-like customer name opens as text in the supported spreadsheet.
- [ ] Read access can export. Signed-out users get 401 and users without workspace access get 403.
- [ ] Exactly 10,000 matches download. 10,001 returns the documented error without a file.
- [ ] The test suite verifies CSV parsing, filter parity, permissions and both row-limit cases.

## Decisions

- Include voided invoices when the list's filters include them.
- Verify spreadsheet behavior in Excel before release.
