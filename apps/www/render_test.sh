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
# The tokens reach every page inline, with the fonts at the pages' own level, and nothing links the file.
[ "$(grep -cF 'src: url(Geist-Variable.woff2)' configmap.yaml)" = 3 ] || { echo "FAIL: styles/tokens.css is not inlined into the three pages with bare font URLs"; exit 1; }
! grep -qF 'url(../' configmap.yaml || { echo "FAIL: a rendered page still reaches for ../"; exit 1; }
! grep -qF 'href="styles/tokens.css"' configmap.yaml || { echo "FAIL: a rendered page still links styles/tokens.css"; exit 1; }
# Page CSS takes its values from the tokens: no hex colour and no px length in a page's <style>,
# except in an @media condition.
for page in index.html how-it-works.html features.html; do
  bad=$(awk '/<style>/{s=1} s&&!/@media/' "$page" | awk '/<\/style>/{exit} 1' | grep -nE '#[0-9A-Fa-f]{3,8}\b|[0-9]px' || true)
  [ -z "$bad" ] || { echo "FAIL: $page has literals outside the tokens:"; echo "$bad"; exit 1; }
done
git checkout -- configmap.yaml brand.yaml www.yaml 2>/dev/null || true
echo PASS
