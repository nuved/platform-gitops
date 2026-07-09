# platform-gitops

The GitOps source of truth for services running on the managed Kubernetes platform.
**Argo CD** watches this repo and syncs each service into its tenant's isolated
workspace namespace; a **validation gate** (the platform's Kyverno policies) blocks
bad manifests in a PR before they ever reach the cluster.

```
git push → validation gate (CI) → Argo CD sync → workspace namespace
              kubeconform + Kyverno         (per-workspace AppProject)
```

## Layout

```
apps/<service>/       one service per dir (Deployment + Service); Argo Application per dir
argo/projects.yaml    one AppProject per workspace — locked to that namespace + this repo
argo/apps.yaml        one Argo Application per service (auto-sync, self-heal, prune)
policies/             CI mirror of the cluster's tenancy Kyverno policies
scripts/validate.sh   the gate: kubeconform + kyverno apply
examples/             a deliberately-bad manifest to demonstrate the gate
.github/workflows/    runs the gate on every PR
```

## How isolation is enforced (verified on kind)

- **Per-workspace `AppProject`** restricts each tenant's apps to *only their own
  namespace* + this repo + a small resource allow-list. An app targeting another
  namespace (e.g. `kube-system`) is **refused**:
  `namespace 'kube-system' do not match any of the allowed destinations`.
- **Self-heal**: delete a managed resource and Argo restores it (drift correction).
- **Shift-left validation**: the same `tenancy-baseline` + `tenancy-pdb-safety`
  Kyverno rules run in CI, so a privileged container or eviction-blocking PDB **fails
  the PR** with the same message the cluster's admission would give — and admission
  is still the backstop at apply time.
- The deployed pods land in a workspace that already enforces quota, LimitRange,
  NetworkPolicy, and RBAC (see the tenancy-operator).

## Deploy a service

Either hand-write a dir under `apps/`, or use **`nuvedctl`**:

```sh
nuvedctl deploy --repo . --service web --workspace acmecorp-web \
  --image myrepo/web:1 --replicas 2
nuvedctl validate .          # run the gate locally
git add -A && git commit -m "deploy web" && git push   # Argo syncs it
```

Then add an Argo `Application` for the new path (see `argo/apps.yaml`) — or manage
those centrally with an `ApplicationSet`.

## Validate locally

```sh
./scripts/validate.sh apps       # PASS
./scripts/validate.sh examples   # FAIL (privileged container)
```

Requires `kubeconform` and the `kyverno` CLI.
