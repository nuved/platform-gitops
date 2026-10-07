# Impressum and Datenschutz for nuved.io: notes for the lawyer and the operator

**ENTWURF — anwaltliche Prüfung erforderlich.** Allgemeine Information und Arbeitshilfe, keine
Rechtsberatung; ersetzt keine anwaltliche Prüfung. Rechtsstand: 7 October 2026. Technical facts
as of 7 October 2026.

Four draft pages, German first, English as a translation:

| file | what |
|---|---|
| `impressum.html` | Impressum (§ 5 DDG, Art. 11/12 DSA, § 36 VSBG) |
| `datenschutz.html` | Datenschutzerklärung (Art. 13 DSGVO, § 25 TDDDG) |
| `en/impressum.html` | Legal notice, English |
| `en/datenschutz.html` | Privacy policy, English |

Each page opens with the red ENTWURF banner, carries `<meta name="robots" content="noindex">`,
and has dashed "Prüfhinweis / Review note" boxes beside the claims that need a decision or a
check. Values only the operator can supply are red `[[PLACEHOLDERS]]`.

**None of this is served.** The site ships only what `render.sh` lists in `PAGES`, and these
files are not listed. The `en/` pages can't ship as they are either: the box deploy
(`apps/www/hetzner/unpack.py`) refuses ConfigMap keys containing `/`. Publishing needs a
separate change to `render.sh` (and a flat name or an nginx rule for `/en/`), which is outside
this draft.

## Before publishing

1. The lawyer reviews the German pages; the English ones follow the result.
2. The operator fills every placeholder below.
3. Every `.review` box, the `.draft` banner and the `noindex` meta come out.
4. The technical gaps further down are either fixed or the text is changed to describe them.
5. The homepage footer links to both pages (today it links to neither).

## Placeholders

| placeholder | where | what goes in |
|---|---|---|
| `[[ANBIETER]]` | both pages | name of the provider: a natural person, or the company with its legal form (see question 1) |
| `[[STRASSE_HAUSNUMMER]]`, `[[PLZ_ORT]]` | both | address where documents can be served; no PO box |
| `[[RECHTSFORM]]` | Impressum | e.g. GmbH; drop the line for a natural person |
| `[[VERTRETUNGSBERECHTIGTE]]` | Impressum | managing director(s); drop for a natural person |
| `[[REGISTERGERICHT]]`, `[[REGISTERNUMMER]]` | Impressum | e.g. Amtsgericht …, HRB …; drop if not registered |
| `[[UST_IDNR]]` | Impressum | VAT ID under § 27a UStG, only if one has been issued |
| `[[WIRTSCHAFTS_IDNR]]` | Impressum | business ID under § 139c AO, only if issued |
| `[[KONTAKT_EMAIL]]` | Impressum | an address that is actually delivered (see gap 4) |
| `[[TELEFON]]` | Impressum | a phone number, or a second contact route (question 3) |
| `[[DSA_KONTAKT_EMAIL]]` | Impressum | DSA single point of contact (Art. 11 and 12) |
| `[[MELDE_EMAIL]]` | Impressum | where reports of illegal content go (e.g. abuse@nuved.io, once it exists) |
| `[[VSBG_ERKLAERUNG]]` | Impressum | the § 36 VSBG sentence (question 5) |
| `[[NAME_ANSCHRIFT_INHALTLICH_VERANTWORTLICH]]` | Impressum | only if § 18(2) MStV applies (question 6); otherwise drop the section |
| `[[DATENSCHUTZ_EMAIL]]` | Datenschutz | address for data protection requests |
| `[[DSB_ODER_NICHT_BENANNT]]` | Datenschutz | the data protection officer's contact, or "nicht benannt" |
| `[[AUFSICHTSBEHOERDE_NAME_ANSCHRIFT]]` | Datenschutz | the supervisory authority for the provider's seat (Berlin's if it is GrowGoddess GmbH, Berlin) |
| `[[LOG_FRIST]]` | Datenschutz | the server log period, once one is set (gap 1) |
| `[[AUTHENTIK_EREIGNIS_FRIST]]` | Datenschutz | authentik's event retention setting, read from the instance (gap 6) |
| `[[AUTHENTIK_SITZUNGSDAUER]]` | Datenschutz | authentik's session lifetime after sign-in, read from the login stage |
| `[[MAIL_FRIST]]` | Datenschutz | how long correspondence is kept when no retention duty applies |
| `[[HGB_FRIST_FALLS_KAUFMANN]]` | Datenschutz | § 257 HGB period if the provider is a Kaufmann (a GmbH is); otherwise drop |
| `[[S3_VERSCHLUESSELUNG_KONSOLE_AUTHENTIK]]` | Datenschutz | how those two backups are encrypted, after gap 2 is decided |
| `[[HETZNER_ANSCHRIFT]]`, `[[CLOUDFLARE_ANSCHRIFT]]`, `[[GITHUB_ANSCHRIFT]]` | Datenschutz | each provider's address from the operator's contract / DPA |
| `[[STRIPE_VERTRAGSPARTNER_UND_ANSCHRIFT]]`, `[[STRIPE_ORT]]` | Datenschutz | the Stripe entity on the operator's account (question 9) |
| `[[AWS_VERTRAGSPARTNER_UND_ANSCHRIFT]]` | Datenschutz | the AWS entity on the operator's account |
| `[[PRUEFEN]]` | Datenschutz, table 14 | each transfer basis, confirmed (question 8) |
| `[[AVV_ORT]]` | Datenschutz, section 11 | where customers conclude the DPA (console, PDF); section only once hosting is offered |
| `[[DATUM_DER_VEROEFFENTLICHUNG]]` | Datenschutz | the date the final version goes live |

Recalled addresses, offered for convenience and not checked: Hetzner Online GmbH, Industriestr. 25,
91710 Gunzenhausen; Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA; GitHub, Inc.,
88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA; Stripe Payments Europe, Limited,
1 Grand Canal Street Lower, Dublin 2, Ireland; Amazon Web Services EMEA SARL, 38 Avenue John F.
Kennedy, L-1855 Luxembourg. Take each from the contract the operator actually signed.

## Open legal questions

1. **Who is the provider and controller?** `platform-cluster docs/venture/business/pitch-en.md`
   says nuved invoices through GrowGoddess GmbH, Berlin, until it has its own company, and that a
   written agreement on software, brand and customer contracts comes before the first invoice;
   `growgoddess/proposal-de.md` is only a proposal. The answer decides the Impressum fields, the
   supervisory authority, and in whose name the DPAs with Hetzner, Cloudflare, Stripe, AWS and
   GitHub must be concluded. If the accounts are in the founder's own name but GrowGoddess GmbH
   is the controller, they are in the wrong name.
2. **Kleinunternehmer?** Whether § 19 UStG applies (verified today: prior year ≤ €25,000 and
   current year ≤ €100,000) decides whether a VAT ID line exists and whether prices are gross;
   the share pricing decision already makes a Steuerberater's written note a gate before the
   Stripe live key. GrowGoddess GmbH would answer this for itself.
3. **Second contact route.** Is an email address enough under § 5(1) no. 2 DDG, or is a phone
   number or contact form needed? (CJEU C-298/07 of 16 October 2008, recalled, not re-checked.)
4. **Is nuved an intermediary service under the DSA?** The relay passes shares through (mere
   conduit?) and nuved.app will host customer services (hosting). If yes: Art. 11/12 contacts
   (drafted), Art. 14 terms, Art. 16 notice and action, Art. 17 statements of reasons. Small and
   micro enterprises are exempt only from the online-platform section, not from these (recalled;
   check Art. 19 DSA). The decision file lists a takedown runbook as a go-live gate (8b); it isn't
   written.
5. **§ 36 VSBG wording.** Does nuved sell to consumers (it is invitation-only today, and the
   pitch targets freelancers and teams)? If yes, the ≤ 10 employees exemption in § 36(3) covers
   only no. 1; no. 2 bites only if the provider has committed to or is obliged to take part.
6. **§ 18(2) MStV.** Needed only for journalistic-editorial content. Product pages today; a blog
   on nuved.io would change that.
7. **Role allocation for share guests.** For the e-mail addresses a sharer puts on an invite list,
   is nuved its own controller, the sharer's processor (Art. 28), or joint controller (Art. 26)?
   The draft treats nuved as its own controller with Art. 6(1)(f). The opt-out and report lists
   serve nuved's own anti-abuse purpose either way.
8. **Third-country transfers.** Cloudflare (proxy for every hostname, so every IP address and
   request), Stripe (payment data), AWS (backups in eu-central-1, US parent), GitHub (encrypted
   backup copies). The draft names the EU-US DPF adequacy decision (EU) 2023/1795 plus SCCs; the
   DPF list status of each entity must be checked on dataprivacyframework.gov and dated. Open
   points: whether age-encrypted copies at GitHub are personal data from GitHub's side (CJEU case
   law on relative identifiability, recalled); whether plain dumps at AWS need a transfer
   impact assessment given the US parent (gap 2 removes the question).
9. **Stripe's role.** Processor, independent controller, or both for Checkout payment data, and
   which Stripe entity contracts with the operator.
10. **Art. 22.** A referral credit is refused automatically when both sides paid with the same
    card fingerprint; services pause automatically at a zero balance. The draft says neither is
    an Art. 22 decision; please confirm.
11. **Retention periods.** § 147(3) AO: eight years for Buchungsbelege (verified today); the
    ledger rows are the balance's accounting record. Which periods apply to the console's
    activity log, the relay's per-day counts and authentik's sign-in events is a choice the
    operator must make and the lawyer should sanity-check.
12. **Data processing agreement for customers.** Needed once nuved hosts customers' services or,
    depending on question 7, for shares. The decision file lists "AVV with TOMs" as gate 8b.
13. **Terms of service** don't exist yet. A paid plan for consumers needs § 312k BGB (the
    cancellation button) and the prepaid balance questions in the share pricing decision (PSD2
    limited network, VAT on single-purpose vouchers); out of scope here, named so it isn't lost.

## Technical gaps found while drafting (operator / engineering, not the lawyer)

1. **Server logs have no fixed retention.** The edge nginx (container `sprachbrucke-nginx`,
   shared with other projects) logs real client IP, path, referrer and user agent for every
   request to stdout (`/etc/nginx/nginx.conf` on the box, `log_format json_combined`); Docker
   keeps 3 × 10 MB. On 7 October 2026 the oldest line was from 16 September 2026. Set a fixed
   period or describe the criterion.
2. **Console and authentik backups are not client-side encrypted.** `backup-github/README.md`
   (platform-cluster dev): `authentik/slot-NN.dump` and `nuved/slot-NN.dump` are plain in S3
   (SSE-S3 only); relay, Forgejo and git-plane sets are age-encrypted. The brief's "encrypted
   backups" holds for S3's at-rest encryption, not against AWS.
3. **`s3://novid-nuved-backups/aws-teardown/`** holds the AWS-era dumps (plans, gitplane,
   litellm, tenant git repositories, kops state) with no deletion date
   (`~/infra/nuved-backup/backup.tf`).
4. **hello@nuved.io and abuse@nuved.io have no mailbox or alias** (operator's memory note of
   6 October 2026; not re-checked on Mailu). hello@ is on the live homepage.
5. **No self-service account deletion** in the console, and no deletion of `events` (activity
   log) rows (grep of plans-backend dev, 7 October 2026).
6. **authentik event retention** was not read from the instance; the policy needs the real value.
7. **Relay per-day counts** (`accounting` table) for a sharer's own traffic have no time-based
   deletion; only guest rows are folded away when the guest is removed.
8. **The visit list** (Pro, "who opened it", 90 days) is not built
   (mansoor-tunnel `docs/DECISIONS.md`, "Not done"); the brief listed it. The draft doesn't
   describe it; it needs a paragraph before it ships.
9. **Customer hosting on nuved.app is not offered** (console answers 503 for project creation,
   plans-backend `deploy/hetzner/README.md`); section 11 is drafted for when it is.

## What was verified, and how

Law, checked on 7 October 2026:

| claim | source |
|---|---|
| § 5(1) DDG items 1–8, incl. "Adresse für die elektronische Post" | gesetze-im-internet.de/ddg/__5.html, verbatim text fetched |
| § 25(1), (2) no. 2 TDDDG (law name TDDDG) | gesetze-im-internet.de/ttdsg/__25.html |
| § 36(1)–(3) VSBG, ≤ 10 employees exemption from (1) no. 1 | gesetze-im-internet.de/vsbg/__36.html, verbatim |
| § 19(1) UStG thresholds €25,000 / €100,000 | gesetze-im-internet.de/ustg_1980/__19.html, verbatim |
| § 27a UStG (VAT ID) | gesetze-im-internet.de/ustg_1980/__27a.html |
| § 147(3) AO: 10 / 8 (Buchungsbelege) / 6 years | gesetze-im-internet.de/ao_1977/__147.html, verbatim |
| § 257 HGB (Kaufmann's records) | gesetze-im-internet.de/hgb/__257.html (paragraph (1) read; its period in (4) not read) |
| § 38(1) BDSG, 20 persons | gesetze-im-internet.de/bdsg_2018/__38.html (summary of the page) |
| Art. 11, 12 DSA wording | dejure.org/gesetze/DSA/11.html and /12.html (consolidated text, not EUR-Lex: EUR-Lex refused automated fetches) |
| Art. 13 DSGVO items | dejure.org/gesetze/DSGVO/13.html |
| ODR platform switched off 20 July 2025, Regulation (EU) 2024/3228 | IHK pages (ihk.de, several chambers); not the Official Journal |
| DPF adequacy decision (EU) 2023/1795 of 10 July 2023; T-553/23 dismissed 3 September 2025; appeal C-703/25 P | web search results incl. EUR-Lex and Hessian DPA listing; the appeal is from a secondary source only |
| DPF participation of Cloudflare, Stripe, LLC, GitHub, AWS | vendor documents and secondary sources via web search; **not** checked on dataprivacyframework.gov |

Recalled, not checked: that authentik stores passwords only as hashes (Django's hashers); § 18(2) MStV; CJEU C-298/07; authentik's default event retention (one
year); the providers' addresses above; Stripe Payments Europe, Limited as the EEA contracting
entity; Art. 19 DSA scope; CJEU case law on encrypted data and relative identifiability.

Technical facts, read or run on 7 October 2026:

| fact | how |
|---|---|
| Box is a Hetzner Cloud server in Nuremberg (NBG1) | RIPE whois of 46.224.192.77: netname CLOUD-NBG1, Hetzner Online GmbH |
| Mailu (mail.fromnovid.com, 49.13.95.214) is a Hetzner Cloud server in Falkenstein | RIPE whois: CLOUD-FSN1; reverse DNS mail.fromnovid.com |
| Every HTTP hostname is proxied by Cloudflare; ssh.nuved.io is direct | `dig` of 13 names; Cloudflare ranges via RIPE whois (CLOUDFLARENET-EU) |
| Quiet-page Worker sets no cookies, logs nothing | `~/infra/nuved/workers/quiet/index.js` (94 lines, grep) |
| S3 bucket novid-nuved-backups is in eu-central-1, SSE-S3, versioned, no public access | `~/infra/nuved-backup/providers.tf`, `backup.tf` |
| 3 daily slots, replaced copy kept 1 day | plans-backend dev `deploy/hetzner/README.md` (Backups), `env.example` BACKUP_SLOTS=3 |
| Only slots 00 and 02 exist today per service; bucket region eu-central-1; `aws-teardown/` holds plans, gitplane, litellm dumps and git repos of 2026-10-06; further prefixes `authentik-data`, `-certs`, `-drill`, `-escrow`, `nuved-escrow`, `relay-escrow` | `aws s3 ls` and `aws s3api get-bucket-location` (read-only, profile novid-terraform) |
| authentik's backup has no BACKUP_SLOTS line and so uses the default 3; the console's says 3 | `grep` of the two backup.env files on the box (read-only); plans-backend dev `deploy/hetzner/backup/backup.sh:20` |
| GitHub copy: private repo nuved/backups, age-encrypted to escrow + drill keys, 3 slots | platform-cluster dev `backup-github/README.md` |
| Console stores the data listed in section 6 | plans-backend dev `internal/store/schema.sql` |
| Console cookies, names and lifetimes | plans-backend dev `cmd/main.go` (sessionMaxAge 30 days), `cmd/oidc.go` (10 min flow), `cmd/pending.go`, `cmd/cookies_test.go` |
| Stripe Checkout, payment mode; email, tenant, amount sent; fingerprint and receipt URL kept | plans-backend dev `internal/stripex/stripex.go` |
| Console frontend loads nothing third-party; no analytics | grep of `web/` (workbox-google-analytics only as an unused transitive dependency) |
| Traces: attribute allow-list without IP, email, user agent, URL; Jaeger TTL 168 h; relay proxy sampling 1 % | plans-backend dev `internal/tracing/tracing.go`, `deploy/jaeger/compose.yaml`; mansoor-tunnel dev `cmd/relayd/main.go` |
| Relay guest data and retention table | mansoor-tunnel dev `docs/PRIVACY.md`; schema in `internal/store/store.go` |
| Relay cookies `_share_session` 30 days (email + host, HMAC-signed), `_share_login` 10 min | mansoor-tunnel dev `internal/proxy/invite.go` |
| Relay forwards visitor IP to the shared service | mansoor-tunnel dev `internal/proxy/proxy.go` (X-Forwarded-For from CF-Connecting-IP) |
| Guest codes sent as auth@fromnovid.com via Mailu | mansoor-tunnel dev `docs/OPERATIONS.md` (mail settings) |
| Account mail as auth@nuved.io via Mailu | plans-backend dev `deploy/hetzner/env.example`; platform-cluster `authentik/blueprints/00-shared-flows.yaml` header |
| Mails load the wordmark from https://nuved.io/brand/ (same URL for all) | platform-cluster dev `authentik/hetzner/templates/email/*` (`nuved-wordmark.png`); plans-backend dev `internal/invite/invite.go:95` (`nuved-wordmark.svg`) |
| Sign-up invitation-only; fields username, name, email, password | platform-cluster dev `authentik/apps/shared.yaml` (`signup_open: false`), `00-shared-flows.yaml` prompts |
| No GitHub sign-in on auth.nuved.io | platform-cluster dev `authentik/hetzner/README.md` (GitHub sign-in note) |
| authentik error reporting off; GeoLite2 databases inside the container | `authentik/hetzner/compose.yaml`; `ls /geoip` in `authentik-server` (read-only) |
| `authentik_session` set when the flow starts; no cookies on nuved.io or Cloudflare | `curl -D -` against auth.nuved.io and nuved.io |
| Edge access log format and Docker rotation | read-only `docker exec sprachbrucke-nginx` and `docker inspect` on the box |

Not verified: what the console's, relay's and authentik's own container logs contain (they
rotate at 3 × 10 MB like the edge's); Cloudflare zone settings (bot management cookies, log
retention on Cloudflare's side); whether the operator's Mac staging holds copies of production
personal data; the desktop app (nuved-desktop) and its data flows, which this draft does not
cover.
