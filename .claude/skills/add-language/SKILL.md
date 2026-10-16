---
name: add-language
description: Checklist for adding a locale to the app - the places that have to change together, from the Language enum to every redirect rule in vercel.json. Use when adding a language, wiring up a new locale, or changing the country redirects.
---

# Adding a language

A locale is wired in seven files. Missing one usually fails silently: the app still builds, and the
mistake shows up as a wrong redirect in production. Work the list in order and check every item.

Throughout: `<code>` is the two letter locale code (`he`), `<language>` the English name in lower
case (`hebrew`). Commit `4318df9` added Hebrew and is the reference diff.

## 1. The wiki bot data has to exist

`src/data/cards.<language>.json`, `src/data/editions.<language>.json` and
`src/data/card-types.<language>.json` come from the wiki bot. Without them step 3 does not compile.
If they are missing, the language is not translated in the wiki yet - stop here and say so.

## 2. `src/app/models/language.ts`

Add the enum entry, sorted alphabetically by the English name:

```ts
Hebrew = 'he',
```

## 3. `src/data/translations.<language>.ts`

New file, same shape for every language - three imports of the generated JSON and three re-exports:

```ts
import { CardTranslation } from 'src/app/models/card';
import { CardTypeTranslation } from 'src/app/models/card-type';
import { EditionTranslation } from 'src/app/models/edition';
import hebrewEditionTranslations from './editions.hebrew.json';
import hebrewCardTypeTranslations from './card-types.hebrew.json';
import hebrewCardTranslations from './cards.hebrew.json';

export const editionTranslations: EditionTranslation[] = hebrewEditionTranslations;
export const cardTypeTranslations: CardTypeTranslation[] = hebrewCardTypeTranslations;
export const cardTranslations: CardTranslation[] = hebrewCardTranslations;
```

## 4. `angular.json` - two separate places

First the locale in `projects.dominionizer.i18n.locales`:

```json
"he": "src/locale/translations.he.xlf"
```

Then a build configuration named after the language, next to the other ones, with both file
replacements:

```json
"hebrew": {
    "localize": ["he"],
    "fileReplacements": [
        { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" },
        { "replace": "src/data/translations.ts", "with": "src/data/translations.hebrew.ts" }
    ]
}
```

## 5. `scripts/build.ts`

Add `<language>` to the `languages` array. English is built separately and is not in that array.

## 6. `src/locale/translations.<code>.xlf`

The translated message file. Generate the source with `npm run extract-i18n` and translate the
units, or take an existing `.xlf` as the template.

## 7. `vercel.json` - the step that gets forgotten

Two edits, and the first one touches every rule in the file:

1. Add `(?!<code>/)` to the negative lookahead in the `source` of **every redirect rule**. They all
   carry the identical alternation; a rule that misses the new code will redirect visitors away from
   the new locale.
2. Add a redirect for the country, next to the others, before the English fallback:

```json
{
    "source": "/:path((?!zh/)...(?!en/).*)",
    "has": [{ "type": "header", "key": "x-vercel-ip-country", "value": "IL" }],
    "destination": "/he/:path*",
    "permanent": false
}
```

The last rule in the list is the fallback to `/en/` and has no `has` block - it still needs the new
code in its alternation.

## 8. Right to left locales

For a RTL language, replace physical CSS properties with logical ones in the component styles that
break, rather than adding a direction specific rule:

```txt
padding-left    -> padding-inline-start
padding-right   -> padding-inline-end
margin-right    -> margin-inline-end
left / right    -> inset-inline-start / inset-inline-end
```

## Verifying

Build the single locale instead of all of them, which is what `npm run build` would do:

```bash
npx ng build --configuration production,<language>
```

Then check the redirect regexes are consistent - every rule has to list the same set of codes:

```bash
node -e "const r=require('./vercel.json').redirects; const s=new Set(r.map(x=>x.source)); console.log(s.size===1?'ok':'rules differ: '+s.size)"
```
