import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { operator } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Terms of service: Sniptide",
  description: "The rules for using the hosted Sniptide service at sniptide.com.",
}

export default function Terms() {
  return (
    <LegalPage title="Terms of service">
      <p>
        These terms apply to the hosted Sniptide service at sniptide.com and app.sniptide.com,
        operated by {operator.name}, {operator.street}, {operator.city}, {operator.country}. The
        Sniptide software is open source under the AGPL-3.0, and that license, not these terms,
        governs a copy you run on your own server.
      </p>

      <h2>Your account</h2>
      <p>
        You need an account to create pastes. Give us a working email address, keep your password
        private, and tell us if you think someone else has access to your account. You are
        responsible for what happens under your account. You must be able to enter a contract under
        the law that applies to you.
      </p>

      <h2>Your content</h2>
      <p>
        You keep all rights to what you paste. You give us the right to store it, copy it between
        our servers and show it to the people you chose through the visibility and link rules you
        set, for as long as it exists. That is all we need the right for.
      </p>
      <p>
        A public paste can be read by anyone. An unlisted paste can be read by anyone who has the
        link, so share the link with care. Pastes are not end-to-end encrypted. Sniptide is not a
        full secrets manager and has no key rotation or audit trail, so do not store data that the
        law requires you to protect in a particular way.
      </p>

      <h2>What you must not do</h2>
      <ul>
        <li>Publish content that is illegal where you live or where we operate.</li>
        <li>
          Publish malware, phishing pages, or credentials and personal data that belong to someone
          else.
        </li>
        <li>Harass people or use the service to attack other systems.</li>
        <li>
          Get around limits, for example by sending automated requests faster than the API allows,
          or probe the service for weaknesses without our permission.
        </li>
      </ul>

      <h2 id="reporting">Reporting a paste</h2>
      <p>
        To report a paste you believe is illegal, write to{" "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a> with the link to the paste, why
        you think it is illegal, your name and email address, and a statement that you are acting in
        good faith. We confirm that we received your report and tell you what we decided.
      </p>
      <p>
        When we remove a paste or restrict an account, we email the account&apos;s owner what we did
        and why, which rule or law it rests on, and how to contest the decision. We decide each case
        ourselves and do not use automated moderation. You can contest a decision by replying to
        that email.
      </p>

      <h2>Availability and changes to the service</h2>
      <p>
        The service is free of charge and we run it with care, but we do not promise it will always
        be available or that nothing will be lost. Keep your own copy of anything you cannot do
        without. The command line tool can export your pastes. We may change or end features, and if
        we end the whole service we announce it in the app and on this page at least 30 days before.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can delete your account in the settings at any time. We can suspend or close an account
        that breaks these terms, and we tell you why when we do.
      </p>

      <h2>Liability</h2>
      <p>
        We are liable without limit for intent, for gross negligence, for injury to life, body or
        health and where the law does not allow us to limit liability. In other cases we are only
        liable for breaching a duty that is essential to the service, and only for the damage that
        was foreseeable. Rights that mandatory consumer law gives you stay as they are.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We publish a changed version on this page and announce material changes in the app at least
        30 days before they apply. If you do not agree with a change, you can delete your account
        before it applies.
      </p>

      <h2>Applicable law</h2>
      <p>
        Austrian law applies, excluding its conflict-of-laws rules and the UN Convention on
        Contracts for the International Sale of Goods. If you are a consumer, you keep the
        protection of the mandatory rules of the country where you live. If you use Sniptide for
        your business, the courts in Vienna have exclusive jurisdiction.
      </p>
    </LegalPage>
  )
}
