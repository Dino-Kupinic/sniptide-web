import type { Metadata } from "next"
import { ConsentSettingsButton } from "@/components/consent-banner"
import { LegalPage } from "@/components/legal-page"
import { analyticsInEu, authority, cdn, emailProvider, hosting, operator } from "@/lib/legal"
import { app, docsPages } from "@/lib/links"

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
        demo.sniptide.com, the share links served from sniptide.com, and the Sniptide browser
        extension, VS Code extension, Raycast extension, command line tool and MCP server when they
        connect to app.sniptide.com. A Sniptide server run by someone else is that person&apos;s
        responsibility, and this policy does not apply to it.
      </p>

      <h2>Who is responsible</h2>
      <p>
        The controller under the General Data Protection Regulation (GDPR) is the operator of
        Sniptide, whose name and postal address are given in the <a href="/impressum">Impressum</a>.
        In this policy, &quot;Sniptide&quot; and &quot;we&quot; mean that operator. You can reach us
        at <a href={`mailto:${operator.email}`}>{operator.email}</a>. We have not appointed a data
        protection officer.
      </p>

      <h2>What we process and why</h2>
      <p>
        We process only the data below, and we do not sell it, share it for advertising or build
        profiles from it. Automated screening can hide a public or unlisted paste until a person
        reviews it, as described under Reports and moderation. A person makes every final decision.
      </p>

      <h3>Visiting the website</h3>
      <p>
        When your browser requests a page, the server receives your IP address, the time, the
        address of the page, your browser&apos;s user agent and the page that linked to us. We keep
        this in access logs for {hosting.logDays} days to run the site securely and to find faults.
        Every request first passes through {cdn.provider}, which protects the sites from attacks,
        delivers them and tells us the country of each request. The legal basis is our legitimate
        interest in a secure, working site (Art. 6(1)(f) GDPR).
      </p>
      <p>
        The site loads no third-party scripts, fonts or embeds, so your browser connects only to
        sniptide.com.
      </p>

      <h3>Analytics on the website</h3>
      <p>
        We measure visits and clicks on the website with PostHog. Each event carries the page
        address, the referrer, your browser and device type, your approximate location, the section
        you scrolled to and the button or link you clicked.
      </p>
      <p>
        Unless you accept cookies, the site sets no analytics cookies and stores no visitor
        identifier in your browser. Your browser sends these events to sniptide.com, which passes
        them on to PostHog together with your IP address. PostHog turns your IP address, browser and
        the site into an identifier with a salt that changes every day, so we can count visitors for
        one day but cannot follow anyone from one day to the next. Your approximate location is then
        only the country that our network reports for your IP address. The legal basis is our
        legitimate interest in knowing how the site is used (Art. 6(1)(f) GDPR).
      </p>
      <p>
        The cookie banner asks about two categories separately. If you allow analytics, PostHog
        stores a random visitor identifier in a cookie and in your browser&apos;s local storage. It
        lets us see how one visitor moves across sniptide.com and the app over several visits, for
        example from a page on this site to signing up, and PostHog draws heatmaps from the clicks.
        If you also allow session replay, PostHog records your session on this website, meaning the
        pages you see, your clicks, mouse movement and scrolling, so we can replay it. Replay needs
        analytics. Recordings hide everything typed into a field, such as the blog search. We do not
        use any of this for advertising. The legal basis is your consent (Art. 6(1)(a) GDPR and §
        165(3) TKG 2021). You can change or withdraw it at any time in the{" "}
        <ConsentSettingsButton className="text-[#2a26ec] underline underline-offset-2 hover:no-underline dark:text-[#8f8cff]">
          cookie settings
        </ConsentSettingsButton>{" "}
        or with the Cookies link at the bottom of every page. Withdrawing analytics removes
        PostHog&apos;s cookie and local storage.
      </p>
      <p>
        {analyticsStorage} PostHog acts as our processor under a data processing agreement. It keeps
        session recordings for 30 days and analytics events for up to one year.
      </p>

      <h3>Analytics and error reports in the app</h3>
      <p>
        The app sends selected events, such as signing up, signing in or creating a paste, to the
        same PostHog project. When you allow analytics, the app can read the website&apos;s visitor
        identifier and use it in memory to connect those events to your website visit. Otherwise,
        the app measures use without an analytics cookie. The app does not record sessions or
        automatically capture clicks. App events do not contain paste content, titles, file names or
        paste links, and they never contain the key of an encrypted paste.
      </p>
      <p>
        When the app&apos;s server fails, it sends a report of the error to PostHog. Before it
        leaves the server, the report is stripped of quoted values, email addresses, tokens, page
        addresses beyond their route and anything else attached to the error, so it holds no paste
        content and no account details. The legal basis for both is our legitimate interest in a
        working service and in knowing how it is used (Art. 6(1)(f) GDPR).
      </p>
      <p>
        Events sent without cookies cannot be tied to you, so we cannot look up or delete yours on
        request. If you accepted cookies, write to us with the identifier from the{" "}
        <code>ph_…_posthog</code> cookie and we delete its events and recordings. Blocking requests
        to <code>sniptide.com/_site/ph</code> and <code>app.sniptide.com/api/analytics</code> in
        your browser stops them.
      </p>
      <p>
        You can also <a href="/_site/analytics">exclude this browser from website analytics</a> and{" "}
        <a href={app("/_site/analytics")}>set the same preference for the app</a>. Only when you
        request exclusion do we save a local storage flag. It contains no account or visitor
        identifier and stays until you include this browser again or clear the site&apos;s data. Set
        the preference separately on each site and in each browser. It does not remove past activity
        or change paste view counts.
      </p>

      <h3>Your account</h3>
      <p>
        If you create an account we store your email address, name, username and a hash of your
        password, or the name, email address and picture that GitHub or Google send us when you sign
        in with them. We also store each sign-in session with its IP address and user agent until it
        expires or you sign out, your editor, paste and notification settings, your notifications,
        and the answers you give in the optional welcome questions, such as where you heard about
        Sniptide. When you invite someone to a paste by email or username, we store who has access.
        We do this to provide the service you asked for (Art. 6(1)(b) GDPR).
      </p>
      <p>
        If you turn on email notifications, or ask for a password reset or an email confirmation, we
        send the email through {emailProvider}.
      </p>
      <p>
        You can delete your account in the settings, which removes this data, your pastes and your
        secrets.
      </p>

      <h3>Your pastes</h3>
      <p>
        We store each paste&apos;s files, title, description, language, visibility and rules, such
        as the password hash, expiry and burn-after-read, together with earlier revisions, its
        collection and, for a paste made with the command line tool, the source details it records,
        such as the repository and commit. A public paste can be read by anyone, and an unlisted
        paste by anyone who has the link. A paste you delete stays in your trash for 30 days and is
        then removed for good. Expired and burned pastes are removed as well.
      </p>
      <p>
        You can encrypt a paste end-to-end when you create it. Your browser then encrypts the files,
        file names and description with a key it creates, and we receive and store only the
        encrypted form. The key sits in the part of the link after <code>#</code>, which browsers do
        not send to a server, and in the storage of the browsers that created or opened the paste.
        We never receive the key, so we cannot read an encrypted paste, hand its content to anyone
        or recover it if you lose the key. The title, the link, the visibility, the owner, the
        times, the view counts and the size rounded to a coarse step stay readable to us, so keep
        sensitive details out of the title. This protection relies on the code we serve to your
        browser, as for any web app that encrypts in the browser.{" "}
        <a href={docsPages.encryptedPastes}>Encrypted pastes</a> explains the details and limits.
      </p>
      <p>
        Pastes you do not encrypt are stored as you wrote them, so the operator of a Sniptide server
        can technically read them. Secrets in environment groups are encrypted with a key that our
        server holds, which protects them in the database and its backups but is not end-to-end
        encryption. Their names are stored as you wrote them.
      </p>

      <h3>People who open a paste</h3>
      <p>
        When someone opens a paste, copies its code or reads one of its files as plain text, we
        count it for the paste&apos;s owner. The record holds a hash of the visitor&apos;s IP
        address and browser made with a salt that changes every day, the host of the page that
        linked to the paste, the country as reported by the network in front of the app, and the
        device type. We delete each day&apos;s salt after the day ends, so nobody can link the hash
        back to an address or a browser afterwards. The raw records are removed after about three
        days. The per-day totals are kept for 180 days, and the daily views behind the charts for 90
        days, unless the paste is deleted sooner. Crawlers and link previews are not counted. The
        legal basis is our legitimate interest in giving owners their view counts (Art. 6(1)(f)
        GDPR).
      </p>

      <h3>Extensions, the command line tool and AI agents</h3>
      <p>
        The browser extension, the VS Code extension and agents that support it connect with OAuth.
        We then store the client&apos;s name and the addresses it registered, a hash of each access
        and refresh token, and when the connection was last used, until you revoke it in the
        settings or it goes unused for 30 days. For personal API tokens, which the Raycast
        extension, the command line tool and other agents use, we store a hash of the token, its
        name and scopes and when it was last used. For both we count requests per token and day to
        enforce limits. We do this to provide the connections you set up (Art. 6(1)(b) GDPR).
      </p>
      <p>
        The extensions keep their tokens on your device: the browser extension in Chrome&apos;s
        extension storage, the VS Code extension in the editor&apos;s secret storage, and the
        Raycast extension in its preferences. They send your code only to Sniptide. The browser
        extension and the Raycast extension send no analytics. A VS Code extension installed from
        the Marketplace or Open VSX sends two events to our PostHog project, one when it first
        starts and one each time you sign in, with the editor&apos;s name, the extension&apos;s
        version, how you signed in, whether you use app.sniptide.com and a random identifier made
        only for this. They never hold code, file names, titles, links or your account. Setting the
        editor&apos;s <code>telemetry.telemetryLevel</code> to <code>off</code> stops them. The
        legal basis is our legitimate interest in counting installs (Art. 6(1)(f) GDPR).
      </p>
      <p>
        When you connect an AI agent to Sniptide, the snippets it reads go to that agent and to the
        model provider behind it, under the terms you agreed with them. We do not control that
        processing and are not responsible for it. Encrypted pastes are never returned through a
        token or the MCP server.
      </p>

      <h3>Help and bug reports</h3>
      <p>
        When you send a bug report or feedback from the app, we receive your description, any
        screenshot you attach, the page address without its query, your browser, the app version and
        your account ID. We file it as an issue in Linear, our issue tracker, to answer and fix it.
        When you ask the support assistant a question, the conversation, the page address, your
        browser and your account ID go to Anthropic, which writes the answer with a Claude model.
        The assistant cannot see your pastes or your account. The legal basis is our legitimate
        interest in supporting you and improving Sniptide (Art. 6(1)(f) GDPR). We delete a report
        once it is resolved and no longer needed.
      </p>

      <h3>Reports and moderation</h3>
      <p>
        When someone reports a paste, we keep the report, our decision, its reason and any appeal,
        to enforce our terms and meet our duties under the Digital Services Act. The legal basis is
        our legal obligation (Art. 6(1)(c) GDPR) and our legitimate interest in keeping the service
        free of abuse (Art. 6(1)(f) GDPR). We cannot read an encrypted paste unless the person who
        reports it gives us the full link.
      </p>
      <p>
        We screen public and unlisted pastes automatically for child sexual abuse material,
        pornography, gore, malware and spam. After you create, edit or share such a paste, its
        title, description, file names and file contents go to OpenAI&apos;s moderation service, or
        to Mistral&apos;s if OpenAI is unavailable, and the links in it go to Google Web Risk. Only
        text and links are sent, never images, and no account details go with them. We never screen
        private or encrypted pastes. A clear result changes nothing. A strong match hides the paste
        until a person reviews it, and a weaker match goes to a person while the paste stays
        visible. You can appeal any decision. We keep the categories and scores of each result, not
        a copy of the paste. The legal basis is our legal obligation (Art. 6(1)(c) GDPR) and our
        legitimate interest in keeping the service free of abuse (Art. 6(1)(f) GDPR).
      </p>

      <h3>Abuse protection</h3>
      <p>
        We keep short-lived counters per IP address or account to limit sign-in attempts, password
        guesses on protected pastes, paste creation, support questions and bug reports. The legal
        basis is our legitimate interest in protecting accounts, pastes and the service (Art.
        6(1)(f) GDPR).
      </p>

      <h2 id="cookies">Cookies and browser storage</h2>
      <p>The website saves your cookie choice and uses analytics cookies if you allow them.</p>
      <ul>
        <li>
          <code>sniptide_consent</code> saves which categories you allowed for six months, so the
          banner does not ask again on every page. It is valid for sniptide.com and its subdomains,
          so the app can respect the same answer. It is needed to honor your choice (§ 165(3) TKG
          2021).
        </li>
        <li>
          Only after you allow analytics, PostHog&apos;s <code>ph_…_posthog</code> cookie holds the
          random visitor identifier for one year, and PostHog keeps the same identifier and the
          current session in local storage.
        </li>
      </ul>
      <p>The app stores these in your browser to provide the service:</p>
      <ul>
        <li>
          A session cookie keeps you signed in. It is valid for sniptide.com and its subdomains so
          that the website can send you to your dashboard.
        </li>
        <li>An unlock cookie remembers a paste password for 24 hours.</li>
        <li>A language cookie and a sidebar cookie keep the choices you made for one year.</li>
        <li>
          The keys of your encrypted pastes stay in the browser&apos;s storage for the app until you
          clear the site&apos;s data. Signing out does not remove them.
        </li>
      </ul>
      <p>
        These are needed for the service you asked for, so they do not need your consent (§ 165(3)
        TKG 2021).
      </p>

      <h2>Who receives your data</h2>
      <ul>
        <li>
          {hosting.provider} hosts the servers and the database in {hosting.country}.
        </li>
        <li>
          {cdn.provider} carries every request to sniptide.com and its subdomains, including the IP
          address, and is based in {cdn.country}.
        </li>
        <li>PostHog processes the analytics events and error reports described above.</li>
        <li>{emailProvider}, based in the United States, delivers the app&apos;s emails.</li>
        <li>Linear stores bug reports and feedback, and Anthropic answers support questions.</li>
        <li>
          OpenAI, based in the United States, screens the text of public and unlisted pastes, and
          Mistral, based in France, does so when OpenAI is unavailable.
        </li>
        <li>Google, based in the United States, checks the links in public and unlisted pastes.</li>
        <li>
          GitHub or Google receive a request when you choose to sign in with them, and we receive
          your profile from them. Importing a gist makes our server fetch it from GitHub.
        </li>
        <li>Authorities, where the law requires us to hand data over.</li>
      </ul>
      <p>
        These providers act as our processors under data processing agreements, except GitHub and
        Google when you choose to sign in with them. Where a provider processes data in the United
        States, the transfer relies on its certification under the EU-U.S. Data Privacy Framework or
        on the European Commission&apos;s standard contractual clauses.
      </p>

      <h2>How long we keep data</h2>
      <p>
        We keep your account data until you delete your account. Pastes follow their own expiry and
        your deletions. Logs, sessions, analytics records, reports and counters are kept for the
        periods given above, and we delete data sooner when it is no longer needed for its purpose.
        Backups of the database, when we keep them, are overwritten on a rolling schedule, so
        deleted data leaves them within {hosting.backupDays} days. We keep data longer only where
        the law requires it, for example for a moderation case.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for access to your data, for correction, deletion, restriction and a copy in
        a common format. You can object to processing that rests on our legitimate interests, and
        withdraw a consent at any time without affecting what happened before. Write to{" "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a> and we will answer within one
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
