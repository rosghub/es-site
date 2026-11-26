#!/usr/bin/env bash
# Brings the codespace up to date with main each time someone opens it, before
# the site preview starts. devcontainer.json runs it from postAttachCommand.
#
# It only fast-forwards main when the codespace is on main with no uncommitted
# changes. On a request branch, or with uncommitted work, it only fetches, so
# it never disturbs a request in progress. It never fails, so the preview
# always starts.

set -u

cd "$(dirname "$0")/.." || exit 0

if ! timeout 60 git fetch --quiet origin main 2>/dev/null; then
    echo "sync-main: couldn't reach GitHub. The codespace may be behind main."
    exit 0
fi

branch="$(git symbolic-ref --quiet --short HEAD || true)"
if [ "$branch" != "main" ]; then
    echo "sync-main: on ${branch:-a detached commit}, so main wasn't updated."
    exit 0
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    echo "sync-main: main has uncommitted changes, so it wasn't updated."
    exit 0
fi

before="$(git rev-parse HEAD)"
if ! git merge --quiet --ff-only origin/main >/dev/null 2>&1; then
    echo "sync-main: main has commits that aren't on GitHub, so it wasn't updated."
    exit 0
fi
after="$(git rev-parse HEAD)"

if [ "$before" = "$after" ]; then
    echo "sync-main: main is up to date."
    exit 0
fi

echo "sync-main: updated main from ${before:0:7} to ${after:0:7}."

# New packages need a fresh install. A running preview uses the old
# node_modules, so stop it, and the preview command starts it again.
if ! git diff --quiet "$before" "$after" -- package-lock.json; then
    echo "sync-main: package-lock.json changed. Reinstalling packages."
    pkill -f "vitepress dev" || true
    npm ci --no-audit --no-fund || echo "sync-main: npm ci failed."
fi

exit 0
