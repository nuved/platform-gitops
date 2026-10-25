# The site on design v2 (T-20261025-08, 2026-10-26)

The three pages now take every value from `styles/tokens.css`, the console's v2 tokens
(plans-backend-t07 `design/v2/tokens-v2.css`, the brain's final file, differing only in the
two font URLs), set in Geist Sans and Geist Mono, light by default and dark when the system
asks. Copy is unchanged apart from the false claims the brain ruled on ("Claims corrected"
below). The mesh is one rule, `.hero .head::before` on
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
is under 1 MB, so all twelve are in `shots/`; how-it-works and features were re-shot after the
claims were corrected, the homepage's PNGs came out byte-identical. Contrast is every visible text element against its
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
| `how-it-works-1440-light.png` | 549,225 | 4,104 | 0 fails, lowest 5.13 | 36 px (Everything) | none | none | n/a |
| `how-it-works-1440-dark.png` | 551,315 | 4,104 | 0 fails, lowest 6.11 | 36 px (Everything) | none | none | n/a |
| `how-it-works-390-light.png` | 528,855 | 6,791 | 0 fails, lowest 5.13 | 44 px (nuved.) | none | none | n/a |
| `how-it-works-390-dark.png` | 532,814 | 6,791 | 0 fails, lowest 6.11 | 44 px (nuved.) | none | none | n/a |
| `features-1440-light.png` | 209,841 | 2,420 | 0 fails, lowest 5.13 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-1440-dark.png` | 211,754 | 2,420 | 0 fails, lowest 7.31 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-390-light.png` | 198,515 | 3,384 | 0 fails, lowest 5.13 | 24 px (api.nuved.io/docs) | none | none | n/a |
| `features-390-dark.png` | 199,946 | 3,384 | 0 fails, lowest 7.31 | 24 px (api.nuved.io/docs) | none | none | n/a |

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

## Claims corrected (brain's ruling, 2026-10-26)

The first commit left these as they were and listed them; the brain then ruled on the facts:
the AWS and kops cluster is gone; the site and the console run as docker compose on the Hetzner
box in Germany; there is no Argo CD and no IRSA; rates in FACTS.md's wording ("derived from the
real AWS bill"); `nuved.io` is the console, API and site and `nuved.app` is what runs on the box.
Only the false sentences changed, each read aloud against ui-copy (on-screen sentences at most
20 words, no brand flourish). Where nothing true could stand in for a list row, the row went.

| # | page | before | after | why |
|---|---|---|---|---|
| 1 | `how-it-works.html` | One node. The whole platform, this page included, runs on a single small AWS machine managed by kops. There is no high availability: when that node restarts, everything on it goes down with it. | One machine. The console, the API and this page run with docker compose on one Hetzner machine in Germany. There is no high availability: when that machine restarts, everything on it goes down with it. | the AWS/kops cluster is gone; console, API and site run as docker compose on the Hetzner box |
| 2 | `how-it-works.html` | This page is one of those Services. It is deployed from `apps/www` in the public manifests repo by Argo CD, into a namespace with the same quota, the same policies and the same Gateway as a customer's — no exception for being ours. | This page is built from `apps/www` in the public manifests repo. It runs on the console's machine, in its own read-only container. | no Argo CD, no namespace: the site is a read-only container (uid 101, read-only root) on the box |
| 3 | `how-it-works.html` | Preview, built and operated by one engineer. This page is served from the platform itself, deployed from `apps/www` by Argo CD. | Preview, built and operated by one engineer. This page runs on the console's machine, built from `apps/www`. | no Argo CD |
| 4 | `features.html` | Preview, built and operated by one engineer. This page is served from the platform itself, deployed from `apps/www` by Argo CD. | Preview, built and operated by one engineer. This page runs on the console's machine, built from `apps/www`. | no Argo CD |
| 5 | `how-it-works.html` | An Argo AppProject per platform workspace, locked to that namespace, this repo, and five resource kinds · tag `Argo CD` | (row removed) | no Argo CD now: the row is removed, nothing true replaces it |
| 6 | `how-it-works.html` | No static AWS keys anywhere in the cluster: service accounts assume roles through the cluster's own OIDC issuer · tag `IRSA` | (row removed) | no AWS cluster and no IRSA now: the row is removed |
| 7 | `how-it-works.html` | Cloudflare proxies `*.nuved.io` to the node's fixed address | Cloudflare proxies `*.nuved.app` to the node's fixed address | addresses unified: nuved.io is the console, API and site; nuved.app is what runs on the box |
| 8 | `how-it-works.html` | `<service>-<org>.nuved.io` for your first project, `<service>-<org>-<project>.nuved.io` for the rest. | `<service>-<org>.nuved.app` for your first project, `<service>-<org>-<project>.nuved.app` for the rest. | the same unification; the homepage already said nuved.app |
| 9 | `features.html` | Charged by the hour for what each project reserves, at rates derived daily from our AWS bill | Charged by the hour for what each project reserves, at rates derived from our real AWS bill of September 2026 | the rate card job is off on the box; card 3 (since 2026-09-22) was derived from the AWS bill of 2026-09-15 to 09-20, FACTS.md's 'derived from the real AWS bill' |
| 10 | `features.html` | Addresses on nuved.app, apart from the platform's own domain · tag `next` (Being built) | (row removed) | FACTS.md lists *.nuved.app as live, so it is not 'being built'; the row is removed |
| 11 | `features.html` | meta description: What actually runs behind a Nuved project: who signs you in, what a top-up creates, how an agent token reaches one namespace and nothing else, and which rules the cluster refuses to break. (how-it-works' own, word for word) | meta description: Every Nuved feature you can use today and where to find it, with what is still being built listed apart. | its own description, from the page's lede |

The homepage needed no change: its rates line ("Rates since 22 September 2026, derived from our
AWS bill") is true of card 3, and its addresses were already `nuved.app`.

## Still not what runs (not changed, for the brain)

plans-backend `deploy/hetzner/README.md` (read 2026-10-26; I did not check the live console)
says the console on the box runs with `CLUSTER=none`: "a project created here is its repository
alone, listed ready and `unplaced` until a placement puts it on a machine", and "logs, runs and
the rate card job are off". Present-tense sentences that describe a running cluster therefore
outrun the box, and they are more than the six above. Rewriting them is a product decision,
not a restyle, so they stand as they were:

- `index.html`: the ledger's "It can" list (deploy with kubectl, read logs, restart and scale,
  a public address in seconds), "The cluster itself holds every line below", the FAQ's "they are
  the cluster's own quotas and network rules", and "they fall when the machines get cheaper"
  (the rate card job is off). The terminal and console panel are marked "Example." already.
- `how-it-works.html`: steps 2 to 4 (a `Tenant` in the cluster, the tenancy-operator's
  namespaces, the `kube.nuved.io` proxy), the Paying, Deploying and Visitors lanes (meter every
  ten minutes, Gateway, HTTPRoute, NetworkPolicy), and the enforcement list's tenancy-operator,
  `kube.nuved.io`, Kyverno, CI gate and meter rows.
- `features.html`: "Each project is its own isolated namespace", the NetworkPolicy egress line,
  the kubeconfig download, and the `kube.nuved.io` refusal line.

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
2. Settled: `apps/www/.gitattributes` export-ignores `shots/` and `tools/` (brain, 2026-10-26).
   `git archive HEAD apps/www` lists 16 entries under them without it and 0 with it, and still
   carries `configmap.yaml` and `hetzner/`.
3. The fonts are the console's variable files, 56,800 + 58,048 bytes (112 KiB); DESIGN-v2 says
   72 KiB together, which these files are not. The ConfigMap is 261,553 bytes of 1,048,576.
4. The final tokens make 14 px the phone minimum (`--text-xs`), so the homepage terminal at 390
   wraps its longest lines once where the old 12 px fit them.
