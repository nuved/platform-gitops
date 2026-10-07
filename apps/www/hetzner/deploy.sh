#!/usr/bin/env bash
#
# deploy.sh: nuved.io's site on the Hetzner box, from one commit of this repo. Runs on the Mac.
#
#     apps/www/hetzner/deploy.sh up <commit>    install that commit's apps/www and (re)start it
#     apps/www/hetzner/deploy.sh status         the commit that runs, and its health
#     apps/www/hetzner/deploy.sh down           stop it; every nuved.io path but / then answers 502
#
# A redeploy is a commit: `git archive` sends the commit's apps/www (tracked files only),
# unpack.py turns its generated ConfigMaps into files beside compose.yml, and the container is
# recreated on them. The previous tree stays as site.old until the next install. Rollback is
# `up <the previous commit>`; REVISION names the one that runs. Nothing here is secret.
set -euo pipefail

# nuved-box is the Mac's ~/.ssh/config Host for the box: 46.224.192.77, user deploy, port 22022.
BOX="${BOX:-nuved-box}"
DIR=/srv/nuved/website
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

on_box() { ssh -o ConnectTimeout=10 "$BOX" "set -euo pipefail; cd $DIR; $*"; }

case "${1:-}" in
up)
    [ -n "${2:-}" ] || { echo "usage: deploy.sh up <commit>" >&2; exit 2; }
    # git archive run from a subdirectory archives only that subdirectory: work from the top.
    top="$(git -C "$HERE" rev-parse --show-toplevel)"
    rev="$(git -C "$top" rev-parse --short=12 "$2^{commit}")"
    echo "installing $rev on $BOX:$DIR"
    git -C "$top" archive --format=tar "$rev" apps/www | on_box "rm -rf src.new site.new && mkdir src.new && tar -x -C src.new
        python3 src.new/apps/www/hetzner/unpack.py src.new/apps/www site.new
        cp src.new/apps/www/hetzner/compose.yml compose.yml && rm -rf src.new
        rm -rf site.old && if [ -d site ]; then mv site site.old; fi && mv site.new site
        echo $rev > REVISION
        docker compose up -d --force-recreate --wait --wait-timeout 60 || { docker compose ps -a; exit 1; }
        docker compose ps"
    ;;
status)
    on_box 'cat REVISION; docker compose ps -a
        [ "$(docker inspect nuved-website --format "{{.State.Health.Status}}")" = healthy ] || { echo "nuved-website is not healthy"; exit 1; }
        echo healthy'
    ;;
down)
    on_box "docker compose down; docker compose ps -a"
    ;;
*)
    sed -n '5,7p' "$0" | sed 's/^#     //' >&2
    exit 2
    ;;
esac
