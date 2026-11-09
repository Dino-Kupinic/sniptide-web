# Team invites

<!-- Fictional example. Replace roles, limits, paths and messages with your product's rules. -->

Epic: Workspaces for teams
Updated: 2026-11-09

## Story 1 — Invite a teammate by email

As a workspace owner, I want to invite a teammate by email so they can work with invoices
from their own account.

### Acceptance criteria

- Given an owner with an available seat, when they enter a valid email and select Editor or
  Viewer, the member list shows the invitation as **Pending** and the teammate receives an email.
- Given the email already belongs to a member or has a pending invite, a repeat submission
  shows the existing status and creates no additional invite.
- Given the workspace is at its seat limit or the requester lacks owner access, submitting
  an invitation creates no record and sends no email.

## Story 2 — Accept an invite

As an invited teammate, I want to accept an invitation with my own account so I can join the
workspace with the access my team gave me.

### Acceptance criteria

- Given a valid link and a signed-in account with the verified invited email, accepting the
  invite creates one membership with the selected role and opens the workspace.
- Given a signed-out teammate, opening the link takes them through sign-in or sign-up and
  returns them to the invitation. Verify the invited email before granting access.
- Given an account with a different email, accepting the invite grants no access and asks
  the person to sign in with the invited address.
- Given an expired or revoked link, opening it shows “This invite is no longer valid. Ask a
  workspace owner for a new one.” Reopening an accepted invite creates no second membership.

## Story 3 — Revoke a pending invite

As a workspace owner, I want to revoke a pending invitation so that an invitation sent by
mistake cannot grant access.

### Acceptance criteria

- Given a pending invite, when an owner revokes it, it leaves the **Pending** list, frees
  its reserved seat and can no longer be accepted.
- Given a user without owner access, attempting to revoke the invite leaves it pending.

## Shared rules

- Invites expire after 7 days. Pending invites reserve a seat until accepted, revoked or expired.
- Viewer is the default. Editors can change invoices and Viewers can read them.
- Concurrent actions cannot spend the same last seat or accept a revoked invite.

## Out of scope

- Shareable invite links, custom roles and transferring workspace ownership.
