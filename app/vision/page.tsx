import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  alternates: { canonical: "/vision" },
  title: "Vision",
  description: "Why Sniptide exists and where it is going.",
}

// The founder's statement of why Sniptide exists, written in the first person and signed at the
// end. The claims about installation and integrations match the app repository's README.
export default function Page() {
  return (
    <LegalPage title="Vision" updated={false}>
      <p>
        Sniptide exists because sharing a piece of code should feel as good as the rest of the
        software you use every day.
      </p>

      <h2>Pastebins stopped getting better</h2>
      <p>
        I love software that is modern, fast and carefully made. Pastebins are some of the most used
        tools on the internet, and most of them still look like they were built decades ago. They
        are covered in ads, they look sketchy enough that you hesitate before opening a link, and
        nobody seemed interested in improving them. I wanted a pastebin I would enjoy using, so I
        started building one. It has no ads, on sniptide.com or on your own server.
      </p>

      <h2>A modern pastebin that goes where you work</h2>
      <p>
        Sniptide is a pastebin first. You paste, you get a link, and the page looks good when
        someone opens it. Around that core it adds what sharing needs today: pastes that expire, ask
        for a password or keep their revisions, and snippets you can keep in collections.
      </p>
      <p>
        It is also available wherever you already are. There is a CLI for the terminal, extensions
        for your editor and your browser, and an MCP server so coding agents can search your
        snippets and save new ones. Whatever you have open, a paste should be one command or one
        shortcut away.
      </p>

      <h2>A place for the things that get lost</h2>
      <p>
        Useful code and notes end up in Apple Notes, a Discord channel or a chat thread, and a week
        later nobody can find them. Sniptide gives them a home: snippets you can search, collections
        that keep related pieces together, and a link to send when someone asks.
      </p>
      <p>
        Sniptide has moved toward code and agents because that is where this problem shows up most
        often. An agent that reads a collection as a recipe gets the same benefit you do, and a
        snippet you saved once keeps paying off in every project after it.
      </p>

      <h2>Self-hosting takes one command</h2>
      <p>
        I dislike setups that take an afternoon and a wiki page. Sniptide installs on your own
        server with <code>curl -fsSL https://sniptide.com/install.sh | sh</code>, and the hosted
        version runs the same code. The script needs a server with Docker. Running Sniptide yourself
        is a first-class way to use it, and it will stay that way.
      </p>

      <h2>Open source and bootstrapped</h2>
      <p>
        Sniptide is open source under the AGPL-3.0 license, and it will stay open source. It is also
        bootstrapped. There is no venture capital behind it and I have no plans to raise any, so
        Sniptide answers to the people who use it.
      </p>

      <h2>Where Sniptide is going</h2>
      <p>
        The direction stays the same as Sniptide grows: a pastebin that is a pleasure to use,
        available in every tool you write code in, simple to run yourself and open for anyone to
        read. Every new feature gets measured against that.
      </p>
      <p>Dino Kupinic, founder of Sniptide</p>
    </LegalPage>
  )
}
