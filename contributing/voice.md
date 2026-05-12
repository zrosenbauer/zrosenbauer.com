# How Zac writes — voice & standards

Cross-content voice doc for **everything** that goes into `content/` on zrosenbauer.com — blog posts, projects, designs, pages. It was derived by reading every existing document and pulling out the recurring patterns.

When the patterns conflict with general "good writing" advice, the patterns here win — that's what makes the voice consistent across content types.

This doc covers the **shared** voice rules. Content-type-specific format conventions (heading levels, section arcs, frontmatter quirks) live with each skill:

- Blog posts → [`.claude/skills/add-blog-post/references/format.md`](../.claude/skills/add-blog-post/references/format.md)
- OSS projects → [`.claude/skills/add-oss-project/references/format.md`](../.claude/skills/add-oss-project/references/format.md)
- Designs → [`.claude/skills/add-design/references/format.md`](../.claude/skills/add-design/references/format.md)

If you update this doc, also update any content that drifted from it. The `/add-blog-post`, `/add-oss-project`, and `/add-design` skills all read this file to keep new drafts on-voice.

## The five-second test

Read any new draft out loud. If it sounds like:

- A press release
- A LinkedIn thought-leader post
- A tutorial site you'd skim and forget
- A ChatGPT answer with the chatbot pleasantries stripped out

…it's not on voice. The Zac voice sounds like a friend at a bar telling you about a thing that happened.

## Identity & perspective

- **First person, always.** "I", "we", "me". Not "the author" or "one might note".
- **Use "we" when crediting Joggr / a team.** "At Joggr we use react-dnd…", "Borisa and I figured it out…". Solo work is "I".
- **Third-person Zac is OK for jokes.** The designs page does it deliberately ("Angry Zac smashes the keyboard"). Use sparingly and only when the joke lands.
- **Name names.** Real people get linked. Tools get linked. Companies get linked.
- **Acknowledge what you didn't know / got wrong.** Self-deprecation is part of the trust signal.
- **Irreverent but respectful.** Lean punny, goofy, nerdy as hell. Walks the line, never crosses into NSFW. The vibe is "smart friend riffing", not "edgelord".

## Sentence-level rules

- **Mix sentence lengths.** Short punchy line. Then a longer sentence that takes its time and unwinds the thought without being precious about it. Then short again.
- **Use contractions.** "I'm", "it's", "don't", "you're", "I'll", "I'd". Existing posts do this naturally. Full forms ("I am", "it is", "I had") read stiff and immediately make a sentence sound like a press release or an LLM that forgot.
- **Start in the middle.** No throat-clearing. State the thing.
- **Parenthetical asides are normal.** Use them to add context without breaking the main thread. Bonus points if the aside is funny.
- **Italic for spoken-aloud emphasis.** Sparingly — once or twice per piece.
- **Trailing ellipses for tonal shrug.** "(for now…)". Used to signal "you know what I mean".
- **Light emoji.** End-of-sentence emoji like `😅`, `😬` are OK once or twice. Headings on long-form blog posts get a leading emoji (see blog format doc). Short pieces don't need them.

## Vocabulary rules

### Words/phrases to avoid (sound like AI or marketing)

- **AI vocabulary**: `delve`, `tapestry`, `landscape` (abstract), `pivotal`, `crucial`, `seamless`, `vibrant`, `groundbreaking`, `testament`, `underscore`, `elevate`, `unlock`, `empower`.
- **Tutorial signposting**: "Let's dive in", "In this post we'll explore", "without further ado", "here's what you need to know", "let's break this down".
- **Inflated significance**: "marks a pivotal moment", "represents a shift", "stands as a testament", "in today's evolving landscape".
- **Copula avoidance**: "X serves as Y", "X stands as Y" — just say "X is Y".
- **False ranges**: "from X to Y, from A to B" — overly tidy parallels.
- **Rule-of-three triplets** unless they're actually three things you're listing on purpose.

### Words/phrases that fit

- Plain "is", "has", "uses".
- "we", "you", "I".
- Concrete nouns: actual library names, actual error messages, actual file paths.
- Direct verbs: "broke", "fixed", "shipped", "ran into", "stumbled on".
- Mild profanity-adjacent intensifiers if natural ("the winner was…", "banged his head against the wall"). Don't force them.
- "shit" is OK as a casual intensifier ("the cool shit", "shipped some weird shit"). Use sparingly, only where it lands.
- **Hard line: no slurs, no stronger profanity than "shit".** No exceptions in published content, regardless of how the chat went.

## Punctuation rules

- **No em dashes (—)** in prose. Use commas, periods, or parentheses. Existing posts contain a few em dashes inherited from older drafts — those are tech debt, not the standard. New content should not add more.
- **Straight quotes only.** `"like this"`, `'like this'`. Never curly. YAML frontmatter requires single straight quotes.
- **Ellipses are three dots `...`**, not the Unicode `…` character (it doesn't matter for display, but be consistent with the keyboard form).
- **Inline code** for library names, function names, file paths: `react-dnd`, `DndProvider`, `content/blog/posts/`.

## Frontmatter rules (universal)

- Always single-quote string values: `title: 'foo'` not `title: "foo"` or `title: foo`.
- Dates are `YYYY-MM-DD`.
- After editing any content, run `pnpm typecheck` from the repo root — contentlayer validates frontmatter at build time and a missing/malformed field fails the build.

## What to do when unsure

When deciding between two phrasings, pick the one that sounds more like one specific person talking about one specific thing they actually did. Generic = wrong.

## Tone calibration: before / after

### Before (off-voice — too AI / too LinkedIn)

> In today's rapidly evolving frontend landscape, drag-and-drop functionality has emerged as a pivotal interaction pattern. In this post, we'll dive deep into how to properly scope react-dnd, exploring best practices and common pitfalls. By the end, you'll have a comprehensive understanding of the topic.

### After (on voice)

> At [Joggr](https://joggr.ai) we use [react-dnd](https://react-dnd.github.io/react-dnd/) for drag-n-drop functionality. It's a great library, but it has one major downside... it breaks drag-n-drop everywhere else on the page.
>
> TL;DR? If you want to skip the story and just see the fix, [click here](#-the-fix).

The "after" version is the actual opening of `react-dnd-scoping.mdx`. Notice what it does: names the company with a link, names the library with a link, states the problem in one sentence, has a contraction, has a casual ellipsis, and respects the reader's time with a TL;DR.
