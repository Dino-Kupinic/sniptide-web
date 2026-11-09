# Changelog

<!-- Fictional example. Replace versions, dates, changes and links with your release history. -->

All notable changes to Acme are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Recurring invoices can skip a month from the invoice menu.

## [2.4.0] - 2026-11-04

You can now invite your team. Team workspace owners can invite an Editor or Viewer from Settings → Members.

### Added

- Team workspace owners can invite Editors and Viewers by email.
- CSV export on the Invoices page, with the filters you have set.

### Changed

- The Invoices list loads 50 rows at a time instead of 20.

### Fixed

- Totals on invoices with a 0% tax line no longer show "NaN".

## [2.3.1] - 2026-10-21

### Fixed

- Password reset emails reach Outlook inboxes again.

### Security

- Password resets now revoke active sessions. Sign in again on your other devices after a reset.

## [2.3.0] - 2026-10-07

### Deprecated

- The `/v1/invoices/export` endpoint. Use `/v2/exports` instead. It stops working on
  2027-01-31.

## [2.0.0] - 2026-06-16

### Removed

- The legacy PDF theme. Select the default theme before upgrading if your invoices still use it.

[Unreleased]: https://github.com/YOUR-OWNER/YOUR-REPO/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/YOUR-OWNER/YOUR-REPO/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/YOUR-OWNER/YOUR-REPO/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/YOUR-OWNER/YOUR-REPO/compare/v2.0.0...v2.3.0
[2.0.0]: https://github.com/YOUR-OWNER/YOUR-REPO/releases/tag/v2.0.0
