import { type SessionLine, TypedSession } from "@/components/typed-session"

// An agent session that pulls the checkout env group, runs the tests and starts the app with the
// keys set. The output matches what the CLI prints: `env pull` reports a count, and `env run`
// passes the command's own output through.
const lines: SessionLine[] = [
  { kind: "prompt", text: "Run the checkout tests with the real keys, then start the app." },
  { kind: "command", text: "sniptide env pull checkout" },
  { kind: "output", text: "Wrote 4 variables to .env." },
  { kind: "command", text: "sniptide env run checkout -- bun test" },
  { kind: "output", text: "42 pass · 0 fail", tone: "success" },
  { kind: "command", text: "sniptide env run checkout -- bun dev" },
  { kind: "output", text: "Ready on http://localhost:3000" },
  { kind: "reply", text: "Tests pass and the app runs on port 3000. No value was printed." },
]

export function EnvTerminal() {
  return (
    <TypedSession
      lines={lines}
      title={["claude", "~/acme/checkout"]}
      className="lg:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)]"
    />
  )
}
