# Content style guide

An editorial system for technical products, informed by four blog references.

Reviewed 6 November 2026. Sources are identified by aliases throughout. Source links remain in the appendix for verification; aliases are editorial shorthand, not anonymization of the linked websites.

## How this guide fits Sniptide

This guide decides what a post says and how it is built. Three other sources decide the rest, and they win where they disagree with it:

- The copy rules in `DESIGN.md` in the app repository: full sentences, no em dashes, no "It's X, not Y", sentence case, and the vocabulary in `docs/positioning.md` (paste, snippet, pattern, link, self-host, agent).
- The frontmatter schema in `lib/blog.ts`, which the build checks.
- `components/blog/mdx.tsx`, which lists every component a post can use, and the Blog section of the README.

How the guide maps to the blog:

| Guide | On the blog |
| --- | --- |
| Editorial mode and article type | The `category` field. Launches usually go in `product`, engineering explanations in `engineering`, and practical guides in `agents` or `self-hosting` |
| Title patterns | `title`, at most 70 characters, in sentence case |
| Opening | `description` restates the promise in one sentence of 50 to 160 characters, and the first paragraph delivers it |
| Charts, screenshots and diagrams | `<Figure>` with a `caption` that follows the caption pattern in section 6, and a `darkSrc` when it shows the product |
| Code | Fenced blocks with a `title`, `<Tabs>` for alternatives, and `<Steps>` for sequences |
| Primary next step | One link or `<Callout>` in the post's last section. The footer under every post already carries the global sign-up prompt |
| Cover | `cover` and `coverDark` for the index, and `image` for the share card |

## 1. Editorial direction

Write as someone who has done the work and can help the reader make a better decision. Establish a specific problem, offer a clear point of view, and substantiate it with something inspectable: a result, an example, a diagram, a workflow, or code.

The proposed house style combines four strengths:

| Alias | Editorial strength | Best use |
| --- | --- | --- |
| **The Operator** | Candid accounts of real work, with practical lessons and personality | Lessons learned, operational guides, comparisons |
| **The Analyst** | Measured explanations connecting evidence to business consequences | Research, industry analysis, business cases |
| **The Craftsperson** | Patient technical reasoning and a visible authorial perspective | Engineering explanations, design decisions, opinion essays |
| **The Builder** | Concrete product capabilities demonstrated through a useful scenario | Launches, implementation guides, customer workflows |

Choose one primary mode for each article. Borrow supporting techniques from the others. An engineering walkthrough can use an Operator-style admission of failure; a launch can use Analyst-style evidence. Keep one clear relationship with the reader throughout.

**House promise:** every article should leave the reader with an understanding, decision, or action they could not get from a feature list alone.

## 2. What the references actually do

These are interpretations of the sampled posts, not the publishers’ official editorial policies. Evidence labels refer to the source appendix.

### The Operator

The sampled articles make authors visible through first-person experience, uncertainty, and self-directed humor. Their credibility comes from exposing the work: measured outcomes, mistakes, evolving processes, and examples readers can inspect. Headings often resemble questions a colleague would ask. Visuals include performance charts, process diagrams, screenshots, tables, and supporting code. Product links appear inside relevant explanations, followed by a recurring product-positioning block and community questions. [A1–A3]

**Adopt:** candid specificity, practical detail, and permission to admit an unfinished answer.

**Use selectively:** jokes, tangents, and dense internal linking. Personality should help readers stay with the explanation.

### The Analyst

The sample moves from a business need or market finding into evidence, interpretation, and implications. Research is organized into numbered findings; product explanations use concrete business scenarios. Author roles, customer examples, survey methodology, charts, and rollout details establish authority. Contextual CTAs lead to an appropriate product action, documentation, or sales conversation. Newsletter, recruitment, and feedback modules follow as recurring page elements. [B1–B3]

**Adopt:** calm confidence, clear scope, and an explicit connection between facts and decisions.

**Use selectively:** broad market framing. A small feature does not need a thesis about the entire economy.

### The Craftsperson

The technical sample builds understanding from a familiar approach and its limitations toward a more sophisticated mechanism. Code, diagrams, and a companion conversation support that progression. The essays show a recognizable author, acknowledge objections, and explain convictions through technical and personal experience. A milestone post connects product history to its future direction. Related reading, downloading, and hiring recur below the articles; roadmap links also appear in the inspected technical page. [C1–C3]

**Adopt:** explanatory patience and the reasoning behind a decision.

**Use selectively:** long introductions and extensive implementation detail. Each should serve the article’s question.

### The Builder

The launch sample introduces a familiar workflow, identifies a constraint, and demonstrates a new capability with code. The engineering sample makes an abstract system inspectable through scenarios, tables, and sequential diagrams. The customer story follows people doing specific work and uses attributed quotes to support the account. Contextual documentation links and getting-started steps precede recurring deployment and expert-contact prompts. [D1–D3]

**Adopt:** a short path from promise to demonstration, with a clear next step.

**Use selectively:** product and ecosystem references. Include the ones needed to understand or complete the workflow.

## 3. Voice and sentence-level rules

The rules below are the proposed house style distilled from the references. They are recommendations, not measured properties of the entire source archives.

### Be direct, informed, and human

- Address the reader as “you” when explaining their work or choices.
- Use “we” for team decisions and outcomes. Use “I” when personal involvement matters.
- Prefer concrete verbs: inspect, compare, send, review, cache, publish, retry.
- Explain a technical term when the intended reader needs it. Preserve precision where the term is useful.
- Use contractions naturally. Let sentence length vary with the explanation.
- Keep paragraphs centered on one idea; two to four sentences is a useful starting point.
- Use a brief standalone sentence when it deserves emphasis. Avoid making every sentence its own paragraph.

### Earn confidence

Replace adjectives with evidence. State what changed, for whom, and under which conditions. Keep measurement, interpretation, and prediction distinct.

| Avoid | Prefer |
| --- | --- |
| “A seamless collaboration experience” | “Reviewers can comment on the same version without copying it into another tool.” |
| “Blazing-fast performance” | “Report generation fell from 12 seconds to 3 seconds in our test dataset.” |
| “Built for everyone” | “Useful for teams reviewing shared configuration files.” |
| “This proves the workflow is better” | “In this test, reviewers completed the task with fewer handoffs.” |
| “We’re excited to announce a powerful new feature” | “You can now update a shared snippet without changing its link.” |

All examples in this guide are invented illustrations. Numbers are placeholders, not product claims.

### Give personality a purpose

Use humor to make an experience recognizable or to acknowledge your own mistakes. Keep it away from readers’ losses, serious incidents, and explanations that need particular care. An opinion needs a reason and a boundary. A confession needs a lesson.

Avoid generic openings about a rapidly changing world, inflated superlatives, repeated announcements of excitement, and conclusions that merely repeat the introduction.

## 4. Topics, titles, and openings

### Choose a topic with a useful tension

Start from a reader’s problem, a surprising result, a consequential choice, or a change in what they can do. Before drafting, complete this sentence:

“For **[reader]**, this article explains **[specific question]**, using **[evidence or experience]**, so they can **[decision or action]**.”

If the evidence is missing, gather it or narrow the promise.

### Title patterns

These are original examples of useful patterns, rather than copied source headlines.

| Mode | Pattern | Example |
| --- | --- | --- |
| Operator | What changed + result + mechanism | “We cut review time by keeping comments beside the code” |
| Analyst | Finding + affected reader or decision | “Why seat pricing becomes harder when agents do the work” |
| Craftsperson | Familiar question + consequential design choice | “Why a shared document needs more than a text field” |
| Builder | New capability + concrete use | “Keep shared snippets current with version history” |

Use numbers when they make the promise more precise. Put the subject early. Prefer sentence case as the house default. Keep intrigue connected to something the article actually resolves.

### Open with the substance

Use one of four opening moves:

1. **Result:** what improved, how much, and what was previously painful.
2. **Problem:** a recognizable task and the friction inside it.
3. **Question:** a technical puzzle the article will resolve.
4. **Position:** a specific belief and the experience that led to it.

By the end of the opening, readers should understand the subject, its relevance, and the article’s promise. For a launch, make the new capability clear early. For a longer investigation, give enough context to make the question matter.

**Example launch opening:**

“A shared snippet often outlives the message that introduced it. When the code changes, people can keep copying an old version. Version history lets you update the snippet at the same link and inspect what changed.”

**Example engineering opening:**

“Our preview renderer parsed the entire document on every keystroke. That was fine for short notes. At 10,000 lines, editing started to lag. We changed the parser to reuse unchanged sections; here is where that helped and where it added complexity.”

## 5. Article structures

Lengths below are planning ranges chosen for this guide, not measured source averages or mandatory targets. Stop when the reader’s question is answered.

### Product launch (roughly 500 to 900 words)

1. Establish the task and existing friction.
2. State what is now possible and who can use it.
3. Show one representative workflow through a screenshot, short demo, or example.
4. Explain the mechanism at the depth needed to use it.
5. State availability, prerequisites, and meaningful limitations.
6. End with the most direct first action.

Organize sections around user jobs. Use a feature list when readers genuinely need to compare capabilities.

### Engineering explanation (roughly 1,200 to 2,500 words)

1. Start with the problem or result.
2. Explain the original approach and why it reached its limit.
3. Establish a small example or mental model.
4. Explain the chosen mechanism with a diagram and selective code.
5. Discuss alternatives, failure modes, or tradeoffs that affected the decision.
6. Show results with relevant measurement conditions.
7. End with the lesson and a useful next step.

Let readers inspect enough of the implementation to test your explanation. Link to the rest. Explain why code is present before asking readers to work through it.

### Practical guide or lessons learned (roughly 900 to 1,800 words)

1. Describe the real situation and stakes.
2. Establish what you tried or learned.
3. Organize the body around reader questions or decisions.
4. Support each major lesson with a concrete example.
5. Explain the cases where the advice changes.
6. Finish with an actionable checklist, template, or first step.

In comparisons, state evaluation criteria and review dates. Include who should choose each option and acknowledge gaps in your own product. Avoid awarding yourself an automatic win in every category.

### Research or business analysis (roughly 900 to 1,600 words)

1. State the main finding and why it matters.
2. Define the dataset or research population.
3. Group the analysis into a few meaningful findings.
4. Pair each finding with evidence, interpretation, and an implication.
5. Explain limitations and methodology.
6. Offer a next step appropriate to the decision.

Distinguish what respondents expect from what has already happened. Label hypotheses about causes. Preserve denominators and segment definitions.

### Customer story (roughly 700 to 1,300 words)

1. Introduce the person, task, and constraint.
2. Describe how the previous workflow worked.
3. Show the new workflow and the product’s precise role.
4. Support the outcome with an attributed quote, measurement, or concrete example.
5. Explain what remains manual or unresolved when relevant.
6. Invite readers with a similar problem to take the next step.

The customer should remain the main actor. A quote should add judgment or experience that a product description cannot supply.

## 6. Infographics, screenshots, code, and demos

Treat visuals as part of the argument. Decide what a visual must explain before choosing its appearance. The inspected references distinguish decorative covers, evidence charts, technical diagrams, workflow screenshots, and code; these serve different editorial jobs. [A1–A3, B1–B3, C1–C3, D1–D3]

### Choose the format by the reader’s question

| Reader’s question | Best starting format | What to show |
| --- | --- | --- |
| How much changed? | Chart or compact before/after table | Baseline, outcome, units, period, conditions |
| How does it work? | Process, sequence, or architecture diagram | Actors, boundaries, direction, meaningful decisions |
| What would I do? | Annotated screenshot or short demo | Starting state, action, resulting state |
| How do I implement it? | Selective code example | Inputs, essential logic, expected output |
| Which option fits me? | Comparison table | Consistent criteria, limitations, suitable users |
| Why does this structure matter? | Progressive technical diagrams | One running example with increasing detail |
| What is the post about? | Cover illustration | A recognizable subject or idea |

### Placement and narrative

Introduce the question, show the visual, then explain the takeaway. Place supporting evidence near the claim it supports. If a chart is central to the promise, show it early enough to establish that the result is real.

For complex mechanisms, use several focused diagrams with consistent labels. Preserve the same example across prose, diagram, and code. A large all-in-one infographic often asks readers to learn too much at once.

A short opinion essay can work without an explanatory visual. A technical article may need several. Use comprehension needs to determine frequency; do not insert an image every fixed number of paragraphs.

### Charts and infographics

- Give each graphic one clear analytical question.
- Label units, categories, periods, and the source.
- Distinguish measured data from forecasts, estimates, and illustrations.
- Keep comparison scales consistent and disclose exclusions that affect interpretation.
- Use color to encode a difference or highlight a point. Keep that meaning consistent.
- Explain anomalies when they change how the reader should interpret the chart.
- Put the main conclusion in adjacent text so it survives when the image is unavailable.

**Caption pattern:** “What is compared + what changed + the relevant qualification.”

Example: “Median render time for the same 200 documents before and after incremental parsing. Large files improved most; network transfer time is excluded.”

### Screenshots and demos

Crop to the task while retaining enough context to orient the reader. Use readable sample data. Highlight the important area with restrained annotation. Show an outcome rather than an unexplained interface.

For a demo, make the starting state, interaction, and final state understandable without audio. Provide a static fallback or a short textual explanation. Remove waiting that teaches nothing; preserve waiting when it is necessary to understand system behavior.

### Code

Label the language and filename where useful. Keep the example focused on the mechanism being discussed. Show expected output or resulting behavior. Clearly distinguish runnable examples from pseudocode or abbreviated excerpts. Use text explanations for the important lines rather than narrating every line.

### Visual brief template

**Question answered:** …  
**Claim supported:** …  
**Format:** chart / diagram / screenshot / demo / code  
**Inputs or source:** …  
**Required labels and caveats:** …  
**Placement:** after the paragraph explaining …  
**Caption and text alternative:** …

This brief is a recommended production tool, not a source-observed template.

## 7. CTAs and product mentions

The sample has three separate layers: contextual links in the explanation, an article-specific next step, and recurring page modules. Examples include documentation or product actions in the article, followed by newsletter, download, hiring, deployment, or sales prompts supplied by the page template. [A1–A3, B1–B3, C1–C3, D1–D3]

For the house style, give the article one primary conversion goal. Allow secondary links when they help complete the reader’s task.

| Article | Primary next step | Possible secondary path |
| --- | --- | --- |
| Launch | Try or enable the capability | Read setup instructions |
| Engineering explanation | Inspect the implementation or reproduce the example | Explore the relevant product |
| Practical guide | Apply the checklist or use the template | Try a tool used in the workflow |
| Research | Explore the data or assess the implication | Discuss a relevant business need |
| Customer story | Try a comparable workflow | Talk through a more complex implementation |
| Opinion essay | Read the supporting argument or contribute a response | Follow future work |

### CTA copy

Use a concrete verb and object: “Create your first shared snippet,” “Inspect the example repository,” or “Read the migration guide.” Explain prerequisites or availability when they affect the action.

Put the primary CTA where the reader has enough context to act. A contextual link can appear earlier when it is immediately useful. Keep repeated global prompts outside the article’s argumentative flow.

Avoid inserting a signup pitch after every section. Do not force sales contact into an article whose useful next step is a self-serve example. A product mention should clarify how the task is solved, provide evidence, or enable action.

Finish on the next useful thing the reader can do, the implication of the result, or an unresolved question worth pursuing.

## 8. Production and editing checklist

### Before drafting

- Identify the reader and their question.
- Choose the primary editorial mode and article structure.
- Write the central claim and gather its evidence.
- List the examples and visuals that will carry the explanation.
- Choose the primary next step.

### Before publishing

- Does the title accurately promise what the article delivers?
- Does the opening reach substance quickly?
- Can a reader follow the argument through the headings?
- Do important claims have evidence or an explicit qualification?
- Are examples specific enough to be useful?
- Are technical details explained at the intended reader’s level?
- Does each visual answer a question, with readable labels and useful adjacent text?
- Are metrics scoped and hypothetical examples clearly labeled?
- Are tradeoffs and availability clear where they affect a decision?
- Does the CTA follow naturally from the article?
- Have repeated sales language and unnecessary recaps been removed?
- Are time-sensitive facts assigned a review date?

### Reusable writing brief

```text
Reader:
Question or task:
Primary mode: Operator / Analyst / Craftsperson / Builder
Article type:
Central claim:
Evidence and sources:
Opening move:
Main sections:
Running example:
Visuals and the questions they answer:
Limitations or counterarguments:
Primary CTA and destination:
Facts to verify before publication:
```

When drafting with an agent, supply real notes, sources, and product constraints. Ask it to mark missing evidence and visual needs explicitly. Do not let it invent benchmarks, customer quotes, availability, or personal experience to satisfy a structure.

## 9. Research scope and evidence appendix

This is a purposive sample of **12 articles, three per reference**, selected from the four blog indexes to cover different content jobs. It is not an exhaustive crawl, a statistical description of publishing frequency, or a conversion study. Most sampled posts are recent; one older engineering explainer was included to examine technical teaching in depth.

All four indexes were retrieved. Article text and available media descriptions were reviewed. Live desktop visual checks covered A1, B1, C1, and D2, including chart treatment, diagram styling, caption placement, and reading structure. The remaining media observations rely on article content and media descriptions. No mobile-layout audit, complete video review, or interactive-demo evaluation was performed.

The guide’s word ranges, writing rules, templates, and CTA priorities are editorial synthesis. No claim is made that these choices caused the source blogs’ business results.

Source labels below describe the subject rather than reproduce the publishers’ titles.

| ID | Alias | Sample and role | Source |
| --- | --- | --- | --- |
| A1 | Operator | Query-performance improvement; engineering results and diagrams | [Article](https://posthog.com/blog/how-we-made-experiment-queries-fast) |
| A2 | Operator | Maintaining comparison content; practical advice and process evidence | [Article](https://posthog.com/blog/comparison-content-guide) |
| A3 | Operator | Rethinking lifecycle marketing; first-person lessons and expert input | [Article](https://posthog.com/blog/lifecycle-marketing) |
| B1 | Analyst | Platform-leader survey; findings, charts, and methodology | [Article](https://stripe.com/blog/saas-platform-trends-in-AI-era) |
| B2 | Analyst | Real-time database synchronization; product explanation and next steps | [Article](https://stripe.com/blog/real-time-stripe-data-postgres) |
| B3 | Analyst | Internal vendor-payment migration; rollout and operational lessons | [Article](https://stripe.com/blog/stripe-on-stripe-what-we-learned-moving-1b-in-vendor-payments-to-global-payouts) |
| C1 | Craftsperson | Text data structures; progressive teaching through diagrams and code | [Article](https://zed.dev/blog/zed-decoded-rope-sumtree) |
| C2 | Craftsperson | Version milestone; product history, conviction, and invitation | [Article](https://zed.dev/blog/zed-1-0) |
| C3 | Craftsperson | Reasons for investing in AI; objections, experience, and product philosophy | [Article](https://zed.dev/blog/not-building-ai-for-the-money) |
| D1 | Builder | Runtime scheduling launch; workflow explanation and code | [Article](https://vercel.com/blog/introducing-vercel-schedules) |
| D2 | Builder | Production-agent permissions; system explanation, tables, and diagrams | [Article](https://vercel.com/blog/how-vercel-agent-accesses-production-safely) |
| D3 | Builder | Customer prototypes and internal tools; workflow narrative and attributed quotes | [Article](https://vercel.com/customers/how-zapier-turns-ideas-into-working-software-in-hours-with-vercel) |

D3 is a customer-story page linked from its blog index and is included as that content type.
