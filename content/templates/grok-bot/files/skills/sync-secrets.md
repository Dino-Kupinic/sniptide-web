Name: Sync secrets
Description: Run a project with the environment variables from a Sniptide env group, or push a changed .env back, when I mention secrets, env vars or a .env file.

When to use it: I ask to run, test or deploy a project that needs its environment variables, or to update the variables stored in Sniptide.

Inputs: the env group name, such as my-app, and the project folder. The Sniptide CLI needs Node.js 24 or newer and a Sniptide API token in the SNIPTIDE_TOKEN secret. Use a read-only token to run and list, and a token with write access to push.

Steps:

1. Check that SNIPTIDE_TOKEN is set without printing it. If it isn't, ask me to save it as a secret named SNIPTIDE_TOKEN. Never ask me to paste it into chat.
2. Install the CLI if `sniptide --version` fails: `npm install --global @sniptide/cli`.
3. Run `sniptide env list` to find the group. Ask me if the name is unclear.
4. To run something, use `sniptide env run <group> -- <command>`, so the values stay in the process and never touch a file.
5. To push, first run `sniptide env push <group> --file <path> --dry-run` and show me its output. Push only after I approve. If the push is refused because the group changed, tell me and don't use --force unless I ask.

Never run `sniptide env pull`, `env pull --stdout` or anything else that writes or prints values, unless I ask for it and say where the file goes. Files in /workspace are visible to every Bot on this computer.

Check: the command exits with status 0, or the push reports the new revision.

Return: what ran or what changed, with variable names only, never values.
