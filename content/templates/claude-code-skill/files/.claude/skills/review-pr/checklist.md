# Review checklist

## Correctness

- Does the code do what the pull request says, including empty, missing and very large inputs?
- Are errors handled where they happen, with a message a person can act on?
- Do new database queries use an index, and do migrations run on a table with data in it?

## Tests

- Is every change in behavior covered by a test that fails without it?
- Do tests check results rather than implementation details?

## Security

- Is all user input validated before use?
- Do new routes check that the user is signed in and allowed to see the data?
- Are secrets read from the environment, never written in code or logs?

## Readability

- Do names say what things are? Would a new teammate follow the code without the PR description?
- Is there dead code, a leftover `console.log` or a commented-out block?
