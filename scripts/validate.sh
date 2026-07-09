#!/usr/bin/env bash
# Validation gate: schema-check then policy-check every service manifest with the
# same Kyverno rules the cluster enforces at admission. Run in CI on every PR, or
# locally before you commit. Requires: kubeconform, kyverno.
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${1:-apps}"
echo "== validating: $TARGET =="

echo "--> kubeconform (schema)"
find "$TARGET" -name '*.yaml' -print0 | xargs -0 kubeconform -strict -summary \
  -schema-location default \
  -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'

echo "--> kyverno (platform policies)"
mapfile -t files < <(find "$TARGET" -name '*.yaml')
res_args=()
for f in "${files[@]}"; do res_args+=(--resource "$f"); done
kyverno apply policies/ "${res_args[@]}"

echo "== OK: all manifests pass schema + platform policies =="
