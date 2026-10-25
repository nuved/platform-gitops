# The site on design v2 (T-20261025-08, 2026-10-26)

The three pages now take every value from `styles/tokens.css`, the console's v2 tokens
(plans-backend-t07 `design/v2/tokens-v2.css`, the brain's final file, differing only in the
two font URLs), set in Geist Sans and Geist Mono, light by default and dark when the system
asks. Copy and claims are unchanged. The mesh is one rule, `.hero .head::before` on
`index.html`, behind the headline only.

## What changed, page by page

- **All three.** Ink wordmark (no teal dot), nav in the app's 6 px shape with the one ink
  button, hairlines for every edge, blue only on links and the focus ring, headings 600 with
  the tokens' tracking, the footer on the canvas under a hairline. The teal brand is gone from
  the pages' CSS; the favicon data URI and `brand/` are untouched (see open items).
- **index.html.** Hero CTAs are the homepage's pill (`radius-pill`); the console panel keeps
  the app's 6 px buttons. The two views sit in one 12 px hairline card, the terminal white in
  light (the tokens' `term-bg`), the project block now between hairlines instead of a card in
  the card. Money, rates and examples are in Geist Mono. The preview badge is a warn-coloured
  notice; the "not yet" callout keeps a warn bar.
- **how-it-works.html, features.html.** The same shell; rail dots in ink; flow lanes as 12 px
  cards (their stray browser-default `figure` margin is gone); nodes, tags and chips in mono on
  `sunken`; inline code one step smaller than the words, in ink, breaking instead of widening
  the page. The inline `style="margin-top:8px"` became a class.

## Shots and measurements

Taken by `tools/www-shots/shots.cjs` from the rendered `configmap.yaml` (live rate card 3),
Chromium from plans-backend/web's @playwright/test 1.63.0, device scale 1, full page. Every PNG
is under 1 MB, so all twelve are in `shots/`. Contrast is every visible text element against its
painted background (floor 4.5:1, or 3:1 at 24 px and up); inside the hero it is also measured
against the real pixels under each line of text, from a shot with the text made transparent,
because the mesh is a background image the colour walk cannot see. Targets are every `a`,
`button` and `summary`; "inline" is a link inside a sentence, which keeps its line and takes
its 24 px from vertical padding.

| shot | bytes | page px | contrast | smallest target | overflow | gradients | hero pixels |
|---|--:|--:|---|---|---|---|---|
| `index-1440-light.png` | 710,469 | 4,654 | 0 fails, lowest 4.51 | 36 px (Everything); inline 24 | none | .head::before | worst 5.5 |
| `index-1440-dark.png` | 703,029 | 4,654 | 0 fails, lowest 7.66 | 36 px (Everything); inline 24 | none | .head::before | worst 8.13 |
| `index-390-light.png` | 634,637 | 8,272 | 0 fails, lowest 4.51 | 44 px (nuved.); inline 27 | none | .head::before | worst 5.45 |
| `index-390-dark.png` | 633,678 | 8,272 | 0 fails, lowest 7.66 | 44 px (nuved.); inline 27 | none | .head::before | worst 8.13 |
| `how-it-works-1440-light.png` | 573,719 | 4,220 | 0 fails, lowest 5.13 | 36 px (Everything) | none | none | n/a |
| `how-it-works-1440-dark.png` | 575,966 | 4,220 | 0 fails, lowest 6.11 | 36 px (Everything) | none | none | n/a |
| `how-it-works-390-light.png` | 557,395 | 7,097 | 0 fails, lowest 5.13 | 44 px (nuved.) | none | none | n/a |
| `how-it-works-390-dark.png` | 560,853 | 7,097 | 0 fails, lowest 6.11 | 44 px (nuved.) | none | none | n/a |
| `features-1440-light.png` | 216,725 | 2,478 | 0 fails, lowest 5.13 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-1440-dark.png` | 218,629 | 2,478 | 0 fails, lowest 7.31 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-390-light.png` | 204,745 | 3,441 | 0 fails, lowest 5.13 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-390-dark.png` | 206,148 | 3,441 | 0 fails, lowest 7.31 | 24 px (api.nuved.io/docs) | none | none | n/a |

The lowest light pair, 4.51:1, is the preview badge (`warn` on `warn-bg`), the same pair the
console's review measured at the floor's edge; one shade darker on that background breaks it.
The 24 px target on features is the `api.nuved.io/docs` link inside its tag chip.

What I saw in each, looking at every band:

- **index, 1440.** The mesh blooms teal, blue, violet and pink behind the two headline lines and
  fades before the right column; the lede, the two pills and the invitation line sit on the plain
  canvas. The two views read as one white card split by a hairline; the €24.31 balance in mono
  leads the console side. Ledger, steps, pricing and questions are ink rules and hairlines, no
  fills except the walled-off well and the warn badge. Dark: the same layout on #000, the mesh
  deeper and still only behind the headline, the primary pill inverted to near-white.
- **index, 390.** Wordmark row, then the six nav items in two rows of 44 px targets. The headline
  takes three lines over the mesh; the pills go full width. The terminal's 45-character lines
  wrap once at the phone's 14 px minimum (a token, see below); "Download kubeconfig" wraps to
  two lines inside its 44 px button. No sideways scroll anywhere.
- **how-it-works, 1440 and 390.** The rail's ink dots sit on the hairline at each step's
  heading; the four lanes are hairline cards with the chain wrapping inside them; the long API
  path in the Visitors caption breaks inside the card at 390 (it pushed the page to 472 px before
  `code` got `overflow-wrap:anywhere`). The honest note keeps its warn bar.
- **features, 1440 and 390.** Each section is an ink rule over hairline rows with the mono tag
  at the right; at 390 the long tags drop under their line. "Being built" reads the same as the
  live sections, with `next` and `later` as its tags.

## The ux-golden-rules floor at 390 (and 1440)

| rule | measured | threshold | result |
|---|---|---|---|
| 1 contrast | 0 fails on 12 runs; lowest 4.51 light, 6.11 dark; hero pixels worst 5.45 | 4.5:1 text, 3:1 at 24 px | pass |
| 2 targets | 44 px smallest control at 390 (36 at 1440); inline links 27 at 390, 24 at 1440; chip link 24 | ≥ 24 every target | pass |
| 3 primary reach | index 390: "Create account" 358×48, top at y 541 of 844 (in the lower 60 %), the same size as "See the rates" and the only filled one | largest in its group, lower 60 % | pass |
| 4 choice count | nav 6 (index), 5 (how it works), 4 (features); hero 2 calls to action, 1 primary | ≤ 7; ≤ 3, one primary | pass |
| 8 type | body 16 px Geist at 390 and 1440; line-height 1.5 | ≥ 16 on mobile; 1.4–1.6 | pass |
| 16 motion | 150 ms colour transitions on buttons and nav only; `prefers-reduced-motion` turns them off | 150–300 ms, honoured | pass |
| horizontal scroll | `scrollWidth` = 390 on all six phone runs | none | pass |
| 5, 6, 11, 12, 13, 15 | n/a: static pages, no form, no fetch, no destructive action | | n/a |

## Claims that may no longer be true (left as they are, for the brain)

Per the surprise rule, none of these words were changed.

1. `how-it-works.html`, "What this is, honestly": "runs on a single small AWS machine managed by
   kops". README (since 2026-10-07): the AWS cluster is gone; the site runs as the compose
   project `nuved-website` on the Hetzner box.
2. `how-it-works.html`, after the lanes, and the footers of how-it-works and features: "deployed
   from `apps/www` ... by Argo CD, into a namespace with the same quota ...". The box serves it
   through `hetzner/deploy.sh`, not Argo CD.
3. `how-it-works.html`, enforcement list: "No static AWS keys anywhere in the cluster ... IRSA".
   An AWS-specific claim about a cluster the README says is gone.
4. `features.html`, Money: "at rates derived daily from our AWS bill". The live card is card 3,
   since 2026-09-22, derived from the 2026-09-15 to 09-20 AWS bill; nothing has re-derived it
   since. The homepage's "derived from our AWS bill" is true of that card, without "daily".
5. Exposed addresses disagree between pages: the homepage says `<service>-<org>.nuved.app`,
   how-it-works says `<service>-<org>.nuved.io`, and features lists "Addresses on nuved.app" under
   "Being built".
6. `features.html` carries how-it-works' meta description word for word.

## Deviations from the brief

- The shot script is at `apps/www/tools/www-shots/shots.cjs`, not the repo's `tools/`: the hard
  no keeps every edit inside `apps/www`, and the repo has no `tools/` yet.
- `styles/tokens.css` is not served as a file. A ConfigMap key cannot contain `/`, so render.sh
  writes the file into each page in place of its `<link>`. The source pages still load it from
  `styles/` when opened from disk, which is why its two font URLs start with `../`.
- Check 1 does not come back empty: line 7 of `brand/make-wordmark.py` names the old display
  face's file. It draws the brand wordmark (the `brand/` SVG and PNG that Authentik and mail use)
  from that face at 700; re-pointing it at Geist redraws the logo, which waits for the operator.
  Its committed output is unchanged; regenerating it now needs the font from `e84aeec`.

## Open items

1. The brand: `brand/*` and every page's favicon data URI are still the teal mark. Whether the
   wordmark and favicon move to Geist ink is the operator's call; `make-wordmark.py` regenerates
   the wordmark from whichever face it is pointed at.
2. `hetzner/deploy.sh` archives the tracked `apps/www`, so the 5.8 MB (5,680 KiB) of `shots/` now travel to
   the box on every deploy and are deleted there after unpacking. A one-line
   `apps/www/.gitattributes` (`shots/ export-ignore`) would keep them home; not added, since it
   changes what the brain's deploy sends.
3. The fonts are the console's variable files, 56,800 + 58,048 bytes (112 KiB); DESIGN-v2 says
   72 KiB together, which these files are not. The ConfigMap is 262,225 bytes of 1,048,576.
4. The final tokens make 14 px the phone minimum (`--text-xs`), so the homepage terminal at 390
   wraps its longest lines once where the old 12 px fit them.
5. README's page table still lists two pages; `features.html` predates this task and is the third.
