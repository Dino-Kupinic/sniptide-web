import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { analyticsInEu, authority, hosting, operator } from "@/lib/legal"

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy policy",
  description: "What personal data Sniptide processes, why, and what rights you have.",
}

const analyticsStorage = analyticsInEu
  ? "PostHog stores the events in the European Union."
  : "PostHog stores the events in the United States. The transfer relies on [Data Privacy Framework certification or standard contractual clauses, to be confirmed]."

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy covers sniptide.com, the hosted app at app.sniptide.com, the demo at
        demo.sniptide.com and the share links served from sniptide.com. A Sniptide server run by
        someone else is that person&apos;s responsibility, and this policy does not apply to it.
      </p>

      <h2>Who is responsible</h2>
      <p>
        The controller under the General Data Protection Regulation (GDPR) is {operator.name},{" "}
        {operator.street}, {operator.city}, {operator.country}. You can reach us at{" "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>. We have not appointed a data
        protection officer.
      </p>

      <h2>What we process and why</h2>
      <p>
        We process only the data below, and we do not sell it, share it for advertising or build
        profiles from it.
      </p>

      <h3>Visiting the website</h3>
      <p>
        When your browser requests a page, the server receives your IP address, the time, the
        address of the page, your browser&apos;s user agent and the page that linked to us. We keep
        this in access logs for {hosting.logDays} days to run the site securely and to find faults.
        The legal basis is our legitimate interest in a secure, working site (Art. 6(1)(f) GDPR).
      </p>
      <p>
        The site loads no third-party scripts, fonts or embeds. Your browser only talks to
        sniptide.com.
      </p>

      <h3>Analytics on the website</h3>
      <p>
        We measure visits and clicks on the website with PostHog. The site sets no cookies and
        stores nothing in your browser for this. Each event carries the page address, the referrer,
        your browser and device type, your approximate location and the button or link you clicked.
        Session recording is off.
      </p>
      <p>
        Your browser sends these events to sniptide.com, which passes them on to PostHog together
        with your IP address. PostHog turns your IP address, browser and the site into an identifier
        with a salt that changes every day, so we can count visitors for one day but cannot follow
        anyone from one day to the next. {analyticsStorage} PostHog acts as our processor under a
        data processing agreement. The legal basis is our legitimate interest in knowing how the
        site is used (Art. 6(1)(f) GDPR).
      </p>
      <p>
        The app reports to the same PostHog project in the same way, with explicit events such as
        signing up or signing in, and without autocapture. These events never contain paste content,
        titles, file names or links.
      </p>
      <p>
        Because these events cannot be tied to you, we cannot look up or delete yours on request.
        Blocking requests to <code>sniptide.com/_site/ph</code> in your browser stops them.
      </p>

      <h3>Your account</h3>
      <p>
        If you create an account we store your email address, name, username and a hash of your
        password, or the name, email address and picture that GitHub or Google send us when you sign
        in with them. We also store each sign-in session with its IP address and user agent until it
        expires or you sign out, and your editor and paste settings. We do this to provide the
        service you asked for (Art. 6(1)(b) GDPR). You can delete your account in the settings,
        which removes this data and your pastes.
      </p>

      <h3>Your pastes</h3>
      <p>
        We store what you paste, with its title, file names, visibility and rules such as the
        password hash, expiry and burn-after-read. Pastes are not end-to-end encrypted, so the
        operator of a Sniptide server can technically read them. Environment groups are encrypted at
        rest. A public paste can be read by anyone, and an unlisted paste by anyone who has the
        link. A paste you delete stays in your trash for 30 days and is then removed for good.
        Expired and burned pastes are removed as well.
      </p>

      <h3>People who open a paste</h3>
      <p>
        When someone opens a paste, we count the visit for the paste&apos;s owner. The record holds
        a hash of the visitor&apos;s IP address and browser made with a salt that changes every day,
        the host of the page that linked to the paste, the country as reported by the network in
        front of the app, and the device type. We delete each day&apos;s salt after the day ends, so
        nobody can link the hash back to an address or a browser afterwards. The raw records are
        removed after three days, and the per-day totals are deleted with the paste. Crawlers and
        link previews are not counted. The legal basis is our legitimate interest in giving owners
        their view counts (Art. 6(1)(f) GDPR).
      </p>

      <h3>Abuse protection</h3>
      <p>
        We keep short-lived counters per IP address to limit sign-in attempts and password guesses
        on protected pastes. The legal basis is our legitimate interest in protecting accounts and
        pastes (Art. 6(1)(f) GDPR).
      </p>

      <h2>Cookies</h2>
      <p>
        The website sets no cookies. The app sets only cookies that the service needs, so there is
        nothing to consent to:
      </p>
      <ul>
        <li>
          A session cookie keeps you signed in. It is valid for sniptide.com and its subdomains so
          that the website can send you to your dashboard.
        </li>
        <li>An unlock cookie remembers a paste password for 24 hours.</li>
        <li>A language cookie and a sidebar cookie keep the choices you made for one year.</li>
      </ul>

      <h2>Who receives your data</h2>
      <ul>
        <li>
          {hosting.provider} hosts the servers and the database in {hosting.country}.
        </li>
        <li>PostHog processes the analytics events described above.</li>
        <li>
          GitHub or Google receive a request when you choose to sign in with them, and we receive
          your profile from them. Importing a gist makes our server fetch it from GitHub.
        </li>
        <li>Authorities, where the law requires us to hand data over.</li>
      </ul>

      <h2>How long we keep data</h2>
      <p>
        We keep your account data until you delete your account. Pastes follow their own expiry and
        your deletions. Logs, sessions, analytics records and counters are kept for the periods
        given above, and we delete data sooner when it is no longer needed for its purpose.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for access to your data, for correction, deletion, restriction and a copy in
        a common format. You can object to processing that rests on our legitimate interests. Write
        to <a href={`mailto:${operator.email}`}>{operator.email}</a> and we will answer within one
        month. You can also complain to the {authority.name}, {authority.address} (
        <a href={authority.url}>{authority.url.replace("https://", "")}</a>), or to the supervisory
        authority of your own country.
      </p>

      <h2>Changes</h2>
      <p>
        When we change this policy, we publish the new version on this page and update the date at
        the top.
      </p>
    </LegalPage>
  )
}
