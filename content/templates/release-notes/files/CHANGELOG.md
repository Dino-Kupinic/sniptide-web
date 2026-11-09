# Changelog

All notable changes to Acme are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Recurring invoices can skip a month from the invoice menu.

## [2.4.0] - 2026-11-04

You can now invite your team. Owners send invites from Settings > Members, and each teammate
joins with a role that decides what they can change.

### Added

- Team invites with Owner, Editor and Viewer roles.
- CSV export on the Invoices page, with the filters you have set.

### Changed

- The Invoices list loads 50 rows at a time instead of 20.

### Fixed

- Totals on invoices with a 0% tax line no longer show "NaN".

## [2.3.1] - 2026-10-21

### Fixed

- Password reset emails reach Outlook inboxes again.

### Security

- Session cookies now expire after 30 days of inactivity instead of 90.

## [2.3.0] - 2026-10-07

### Deprecated

- The `/v1/invoices/export` endpoint. Use `/v2/exports` instead. It stops working on
  2027-01-31.

### Removed

- The legacy PDF theme. Existing invoices switch to the default theme.

[Unreleased]: https://github.com/acme/acme/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/acme/acme/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/acme/acme/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/acme/acme/releases/tag/v2.3.0
