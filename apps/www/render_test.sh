#!/usr/bin/env bash
# Renders against a fixed card and checks the numbers land in the ConfigMap.
set -euo pipefail
cd "$(dirname "$0")"
card='{"since":"2026-10-02T06:00:00Z","cpu_micro_per_milli_hour":120,"mem_micro_per_gib_hour":7100,"disk_micro_per_gb_month":90000}'
RATES_JSON="$card" ./render.sh
for want in '<!--rate:ex_tiny-->€9<!--/rate-->' '<!--rate:ex_small-->€24<!--/rate-->' '<!--rate:ex_app-->€99<!--/rate-->' 'cost us<!--rate:margin--><!--/rate-->, divided' '€0.12<!--/rate--><small>per vCPU-hour' '€0.0071<!--/rate--><small>per GiB-hour' '€0.09<!--/rate--><small>per GB a month' '2 October 2026<!--/rate-->'; do
  grep -qF "$want" configmap.yaml || { echo "FAIL: configmap.yaml lacks: $want"; exit 1; }
done
grep -qF '€0.105<!--/rate-->' index.html || { echo "FAIL: render.sh must not rewrite the source index.html"; exit 1; }
git checkout -- configmap.yaml brand.yaml www.yaml 2>/dev/null || true
echo PASS
