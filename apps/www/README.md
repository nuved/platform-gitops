# apps/www — the nuved.io website

Two pages, running on the platform as an ordinary tenant workload. They get no
exception for being ours: the same AppProject boundary, the same Kyverno rules at
admission, the same validation gate in CI, and the same shared Gateway as
`apps/api`.

```
*.html, *.woff2  ──render.sh──►  configmap.yaml  ──Argo CD──►  nuved-www
                                                                 nginx-unprivileged
```

| page | serves | what it says |
|---|---|---|
| `index.html` | `/` | the product page: what an agent can and cannot do, what it costs, the questions a buyer asks |
| `how-it-works.html` | `/how-it-works.html` | the mechanism: the four steps, the four request paths, what the platform refuses to run, and what is honestly not built |

The split is deliberate. The homepage names no components and shows no YAML,
because someone deciding whether to use this does not care yet. Everything
technical lives one click away.

Both pages may only claim what runs. That rule comes from
`docs/superpowers/specs/2026-09-15-agent-safe-platform-design.md` in
platform-cluster, and it is why the page talks about `kubectl` with a scoped
kubeconfig rather than the `nuved deploy` command in the design mock: the mock
describes where this is going, the page describes tonight. Anything unbuilt is
either absent or carries a visible mark.

## Files

| file | what it is |
|---|---|
| `index.html` | homepage. **Source of truth.** |
| `how-it-works.html` | the technical page. **Source of truth.** |
| `render.sh` | regenerates `configmap.yaml` from the pages and the fonts. |
| `configmap.yaml` | **generated — never hand-edit.** |
| `www.yaml` | Deployment, Service, HTTPRoute. |
| `schibsted-grotesk.woff2` | display and body face, variable 400–700, latin subset. |
| `ibm-plex-mono-400.woff2`, `ibm-plex-mono-500.woff2` | the terminal and the numbers. |

Both pages carry their own inline CSS and no JavaScript, and the favicon is a
data URI. The only subresource requests either page makes are the three fonts,
and those are served from this origin — opening the page contacts nobody but us.

## Changing a page

```sh
$EDITOR index.html            # or how-it-works.html
./render.sh                   # regenerate configmap.yaml, prints the sizes
../../scripts/validate.sh apps
git commit -am "..." && git push
```

Commit the page and the ConfigMap together. Every key in the ConfigMap becomes a
file in `/usr/share/nginx/html`, because the Deployment mounts the whole
ConfigMap as that directory — so a new page is served by adding it to `PAGES` in
`render.sh`, with no nginx configuration of our own. A mounted ConfigMap is
refreshed by the kubelet within about a minute, and nginx reads the file per
request, so a change reaches visitors without a pod restart.

Current sizes, against a 1 MiB cap on the whole ConfigMap object. `render.sh`
prints these on every run and refuses to write a ConfigMap over the cap:

| | bytes |
|---|--:|
| `index.html` | 26,025 |
| `how-it-works.html` | 19,042 |
| the three fonts | 66,976 |
| `configmap.yaml` | 138,176 |

## The fonts

Schibsted Grotesk (Ellmer Type) and IBM Plex Mono (IBM), both SIL Open Font
License 1.1, which permits redistribution. They are checked in as latin-subset
`.woff2` files taken from the Google Fonts CDN and **served from this origin**.

That is a deliberate choice, not an oversight: linking `fonts.googleapis.com`
would send every visitor's IP address to Google before they have agreed to
anything, which is the exact arrangement a German court has already treated as a
GDPR violation (LG München I, 20 January 2022, 3 O 17493/20). Self-hosting costs
67 KB and settles the question.

Schibsted Grotesk is a variable font, so one file covers weights 400 through 700.
The fonts live in the ConfigMap's `binaryData`, base64 on one line each, because
Kubernetes decodes `binaryData` with StdEncoding and a wrapped block scalar's
newlines would not decode.

The console panel beside the terminal on the homepage is **built in HTML, not a
screenshot.** It mirrors the live console at `https://console.nuved.io/console`
element for element — balance, hourly rate, days left, caps, reservation, service
status, tokens — so it cannot drift into claiming a control that does not exist,
and so it stays readable at 400 px. Compare it against the real console before
changing either one.

## Merge this before the first bootstrap run

The `www` Application in `argo/apps.yaml` carries `targetRevision: main`, the same
as every other app in this repo, because that is what it has to be once this work
is merged. Pinning it to a feature branch would break the moment that branch is
deleted.

The consequence is an ordering constraint. Until this is merged, `apps/www` does
not exist on `origin/main` (`git cat-file -e origin/main:apps/www` fails, while
`apps/api`, `apps/web` and `apps/greeter` all resolve), so an Application created
from a `www` checkout points at a path Argo CD cannot find on `main` and the sync
hangs rather than failing loudly. Merge and push this branch before the first
`bootstrap/up.sh` run, or leave the `www` Application out of `argo/apps.yaml`
until you do. `up.sh` has a preflight that catches this and fails immediately,
naming the app, path and revision.

## What the bootstrap must create first

The Argo `Application` targets namespace **`nuved-www`**, and its `AppProject`
allows nothing else. That namespace is not created here. It must exist before the
app can sync, and it has to be a real workspace so the quota, LimitRange,
NetworkPolicy and RoleBinding are in place:

```yaml
apiVersion: platform.nuved.io/v1alpha1
kind: Tenant
metadata: { name: nuved }
spec:
  plan: standard
  maxWorkspaces: 3
  defaultQuota:
    hard: { requests.cpu: "1", requests.memory: 1Gi, limits.cpu: "2", limits.memory: 2Gi }
---
apiVersion: platform.nuved.io/v1alpha1
kind: Workspace
metadata: { name: nuved-www }
spec:
  tenantRef: nuved
  networkPolicyProfile: isolated
```

Three things the cluster bootstrap owns, not this repo:

1. **The workspace.** Apply the Tenant and Workspace above (this one is seeded
   directly, not bought through Stripe — it is the platform's own page).
2. **A Cilium policy, or nothing serves.** The `isolated` NetworkPolicy the
   operator writes allows ingress from the workspace's own namespace only
   (`isolationPolicySpec`, tenancy-operator `internal/controller/workspace_controller.go`).
   Gateway traffic arrives from outside that namespace, so it is dropped unless
   the `tenancy-allow-gateway` CiliumClusterwideNetworkPolicy is applied. That
   policy selects namespaces carrying `platform.nuved.io/managed: "true"` and
   admits Cilium's reserved `ingress` identity. It lives on the tenancy-operator
   `feat/security-hardening` branch under `config/policies/cilium/`. Without it,
   these pages and `apps/api` all fail the same way: the route attaches, the pod
   is Healthy, and every request times out.
3. **DNS.** `nuved.io` and `www.nuved.io` must resolve to the Gateway.

Route attachment needs nothing from anyone. The listener admits namespaces by
`platform.nuved.io/managed`, and the tenancy-operator stamps that label on every
workspace it creates (`managedLabels`, tenancy-operator
`internal/controller/workspace_controller.go`), so `nuved-www` is admitted the
moment it exists and stays admitted. `bootstrap/manifests/gateway.yaml` in
platform-cluster is the authority on the listener; read it there rather than
trusting this paragraph, because it has changed more than once.

The HTTPRoute here sets no `sectionName` on purpose, so it attaches to whatever
compatible listener the Gateway has rather than pinning one by name. A route
pinned to a listener that later disappears simply stops attaching, with no error
anywhere near the change that caused it. The two `port: 80` values in `www.yaml`
are the Service's own cluster-internal port, not a Gateway listener.

## The pod

`nginxinc/nginx-unprivileged:1.27-alpine`, one replica, PSS restricted: non-root
as uid 101, no privilege escalation, all capabilities dropped, seccomp
`RuntimeDefault`, read-only root filesystem.

That image keeps its pid file and every `*_temp_path` under `/tmp`, so a single
`emptyDir` at `/tmp` is the only writable path it needs — `/var/cache/nginx` is
not referenced by its `nginx.conf`. Every script in `/docker-entrypoint.d/` tests
for a writable target and exits cleanly when the root filesystem is read-only.

Verified on 2026-09-14 by running that image under the same constraints
(`--read-only --user 101:101 --cap-drop ALL --security-opt no-new-privileges
--tmpfs /tmp`): it started with no restarts and served the page byte for byte.
