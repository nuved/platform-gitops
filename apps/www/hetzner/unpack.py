#!/usr/bin/env python3
# unpack.py: turn the site's generated ConfigMaps into the files the box's nginx serves. Runs ON
# THE BOX (python3 and PyYAML are there), from deploy.sh, on one commit's apps/www.
#
#   unpack.py SRC OUT     SRC = apps/www of a commit; OUT is created and must not exist
#
# OUT/html     every key of configmap.yaml (www-html): the pages with the rates render.sh filled
#              in, robots.txt, the fonts
# OUT/brand    every key of brand.yaml (www-brand)
# OUT/conf.d   default.conf from nginx.conf.yaml (www-nginx)
#
# The same three objects the Deployment mounted on the cluster, written the way the kubelet
# writes a ConfigMap volume: data as its exact text, binaryData base64-decoded. So the box serves
# what the cluster served, byte for byte, and the generated files stay the only artifact.
import base64, os, sys, yaml

src, out = sys.argv[1], sys.argv[2]
os.mkdir(out, 0o755)
for name, sub in (("configmap.yaml", "html"), ("brand.yaml", "brand"), ("nginx.conf.yaml", "conf.d")):
    with open(os.path.join(src, name)) as f:
        cm = yaml.safe_load(f)
    d = os.path.join(out, sub)
    os.mkdir(d, 0o755)
    files = {k: v.encode() for k, v in (cm.get("data") or {}).items()}
    files.update({k: base64.b64decode(v, validate=True) for k, v in (cm.get("binaryData") or {}).items()})
    for key, body in files.items():
        if "/" in key or key.startswith("."):
            sys.exit(f"{name}: refusing key {key!r}")
        p = os.path.join(d, key)
        with open(p, "wb") as f:
            f.write(body)
        os.chmod(p, 0o644)
    print(f"{sub}: {len(files)} files from {name}")
