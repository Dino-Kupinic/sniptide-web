# Team invites

Epic: Workspaces for teams
Updated: 2026-11-08

## Story 1: Invite a teammate by email

As a workspace owner, I want to invite a teammate by email, so that they can see and edit our
invoices without sharing my login.

### Acceptance criteria

- Given I am an owner on Settings > Members, when I enter a valid email and choose a role, then
  the invite appears under "Pending" and the person receives an email with a link.
- Given the email already belongs to a member, when I send the invite, then I see "This person
  is already in the workspace" and no email is sent.
- Given the workspace is at its seat limit, when I open the invite form, then the button is
  disabled and links to the billing page.

### Notes

- Roles: Owner, Editor, Viewer. Viewer is the default.
- Invite links expire after 7 days.

## Story 2: Accept an invite

As an invited teammate, I want to join with one click, so that I can start working without
setting up a separate workspace.

### Acceptance criteria

- Given I have an account, when I open a valid invite link, then I land in the workspace with
  the role I was invited with.
- Given I have no account, when I open the link, then I sign up with the invited email filled in
  and join the workspace after verifying it.
- Given the link has expired, when I open it, then I see "This invite has expired. Ask the
  owner for a new one."

## Story 3: Revoke a pending invite

As a workspace owner, I want to revoke an invite I sent by mistake, so that the wrong person
can't join.

### Acceptance criteria

- Given an invite is pending, when I choose Revoke, then it disappears from the list and its
  link shows the expired message.

## Out of scope

- Inviting by link without an email.
- Custom roles.
