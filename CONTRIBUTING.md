# Contributing to Dominionizer

First off, thank you for considering contributing to Dominionizer. It's your ideas and point of view that can make this app better for all of us.

Following these guidelines helps to communicate that you respect our time. In return, we reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

There are many ways to contribute, from telling your friends about the app, asking or answering questions, submitting bug reports and feature requests or writing code which can be incorporated into Dominionizer itself.

## Ground Rules

Please keep the following ground rules in mind when contributing to this project:

-   Help us keep this place open and inclusive.
-   Be patient to get a response to your request. This is a hobby project and we all have jobs and family.

## Easy Contributions

The easiest way to contribute is to open an issue. Though, before you do, check first if an issue with your request already exists.

In case you want to open a new issue, you can choose between the following issue templates:

-   Question
-   Bug report
-   Feature request

These templates add proper labels and provide some structure and guidelines you should follow.

## Advanced Contributions

If you feel strong today you can even contribute changes through a pull request. Make sure there is a corresponding issue where the goal of the change is discussed beforehand. That way you prevent spending hours on a pull request we won't merge.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).

### Environment

We recommend to use [Visual Studio Code](https://code.visualstudio.com/) for development. This project already contains the necessary settings and extension recommendations for VS Code to make following our guidelines a breeze.

There is a series of npm scripts you can use for essential development tasks:

-   `start`: starts the app on a local development server
-   `start:prod`: starts the app in production mode on a local development server (e.g. necessary for testing service worker features)
-   `test`: runs the tests
-   `test:coverage`: runs the tests to generate a test coverage report
-   `eslint`: runs `eslint` on _.ts_, _.js_, _.json_ and _.component.html_ files to generate a linting report
-   `stylelint`: runs `stylelint` on _.scss_ files to generate a linting report
-   `markdownlint`: runs `markdownlint` on _.md_ files to generate a linting report
-   `cm`: runs `cz` to make a commit that follows our conventions

If you use VS Code and our recommended extensions you shouldn't need to run linting tasks because it is executed by VS Code automatically.

### Tests

To deliver a high quality product, we expect that every change is accompanied by proper tests.

### Commit Message Conventions

We have very precise rules over how our Git commit messages must be formatted.
This format leads to **easier to read commit history**.

To support following these rules we added the VS Code extension _Visual Studio Code Commitizen Support_ and the command line tool _commitizen_ to our project that give you an interactive prompt for writing a proper commit message.

Each commit message consists of a **header**, a **body**, and a **footer**.

```txt
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `<header>` is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.

The `<body>` is optional. When the body is present it must conform to the [Commit Message Body](#commit-message-body) format.

The `<footer>` is optional. When the footer is present it must conform to the [Commit Message Footer](#commit-message-footer) format.

Any line of the commit message cannot be longer than 100 characters.

#### Commit Message Header

```txt
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope. All lower case. Use `-` to separate words.
  │
  └─⫸ Commit Type: build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

-   **build**: changes that affect the build system or external dependencies
-   **chore**: changes that don't fit to any other type
-   **ci**: changes to our CI configuration files and scripts (example scopes: github, travis)
-   **docs**: documentation only changes
-   **feat**: a new feature
-   **fix**: a bug fix
-   **perf**: a code change that improves performance
-   **refactor**: a code change that neither fixes a bug nor adds a feature
-   **revert**: reverts a previous commit
-   **style**: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   **test**: adding missing tests or correcting existing tests

##### Scope

At the moment we have no list of concrete scopes but some general rules specified:

-   keep it simple
-   use only lower case character
-   use `-` to separate words (don't use whitespaces)

Choose a fitting scope at your own discretion. Here are some inspirations:

-   `card-comp`: used for changes to the `CardComponent`
-   `shuffle-serv`: used for changes to the `ShuffleService`
-   `github`: used for changes to the CI configuration of GitHub
-   ...

If the changes aren't related to any scope, just leave it empty.

##### Summary

Use the summary field to provide a succinct description of the change:

-   use the imperative, present tense: "change" not "changed" nor "changes"
-   don't capitalize the first letter
-   no dot (.) at the end

#### Commit Message Body

Apply the same rules from the summary and start every line with "- ".

You can use the message body to explain the changes in more detail or to describe the motivation for the changes.

#### Commit Message Footer

The footer is the place to reference GitHub issues or PRs that this commit closes or is related to. It can also conatain co-author references.

```txt
Fixes #<issue number>
<BLANK LINE>
Co-authored-by: <user.name> <<user.email>>
```

### Revert commits

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit.

The content of the commit message body should contain:

-   information about the SHA of the commit being reverted in the following format: `- reverts commit <SHA>`,
-   a clear description of the reason for reverting the commit message.
