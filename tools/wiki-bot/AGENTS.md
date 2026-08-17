# Wiki bot

Generates the card data and images the app ships with, from
[wiki.dominionstrategy.com](https://wiki.dominionstrategy.com/). It is a separate npm workspace
(`dominionizer-wiki-bot`) inside the app repository and writes its output into `../../src`.

## Pipeline

`src/main.ts` wires everything and runs `DominionizerWikiBot`:

1. `wiki-client/` queries the wiki's `api.php`, mostly through its cargo tables, in batches.
2. `builder/` turns each cargo row into the app's shape - editions, card types, cards and their
   translations, plus the images via `sharp`.
3. `validation/` checks the result with joi schemas and amount validators. **Validation warnings do
   not fail the run**, they are collected into a report.
4. The results are written to `../../src/data/*.json` and `../../src/assets/`, then formatted by
   `npm run prettier` at the end of the run.

## Running it

```bash
npm start -w tools/wiki-bot -- --skip-images
```

`WIKI_AUTH_TOKEN` has to be set, from `tools/wiki-bot/.env`; the wiki sits behind a bot protection
and rejects requests without it. The two flags are independent of each other:

- `--update` regenerates only what changed since `last-generation.json`. Without it the bot
  regenerates everything.
- `--skip-images` skips image generation. Use it locally, the images are already committed, and it
  keeps the run and the diff short.

The weekly refresh needs no human: `.github/workflows/run-wiki-bot.yml` runs the bot every Friday
with `--update` and opens a pull request when `src/data` or `src/assets` changed.

## Tests

This workspace runs plain jasmine through `tsx`, not karma:

```bash
npm run test:ci -w tools/wiki-bot
```

There is no TestBed and no `DataFixture` here - build the cargo objects as literals in the spec. The
conventions are otherwise the same as in the app, see the `writing-tests` skill.

## Artefacts that look like documentation but are not

- `card-dependencies.md` - research notes on how card relationships (split piles, cursers, potions)
  can be detected in the wiki. Background for the builders, not a specification of the output.
- `validation-report.md` - written by every run and gitignored. The workflow pastes it into the pull
  request body, which is where the validation warnings surface.
- `last-generation.json` - a single timestamp, the cursor `--update` reads and writes. Committed,
  because the scheduled run depends on it.
