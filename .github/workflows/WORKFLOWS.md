# Workflows

## Goals

-   development branch is buildable and runnable at all times
-   continious deployment
-   weekly wiki bot updates are possible
-   pull requests are possible

## Overview

-   run tests
-   run linters
-   check commit messages
-   create github release
-   deploy app on vercel
-   update data with wiki bot
-   check pull request

## Deployment

-   check if latest commit on master is green
-   set tag v\[number\]
-   push tag

Pushing the tag starts _deploy-release.yml_: it builds the app, attaches the bundle to a new GitHub
release and rebases the _release_ branch onto the tag. Vercel deploys from that branch.
