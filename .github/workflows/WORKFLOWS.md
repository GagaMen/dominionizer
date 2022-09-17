# Workflows

## Goals

-   development branch is buildable and runnable at all times
-   continious deployment
-   weekly wiki bot updates are possible
-   pull requests are possible

## Overview

-   run tests
-   run linters
-   create github release
-   deploy app on github pages
-   update data with wiki bot
-   check pull request

## Deployment

-   check if latest commit on master is green
-   set tag v\[number\]
-   push tag
