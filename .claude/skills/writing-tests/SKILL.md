---
name: writing-tests
description: Test conventions of this repo - AAA layout, the `should` title schema, DataFixture, component stubs and marble assertions. Use when writing or changing a spec file, in the app or in tools/wiki-bot.
---

# Writing tests

Every change ships with tests. The conventions below are already followed across all 44 spec files -
match them instead of introducing a second style.

## Layout

Arrange, act and assert, separated by one blank line each. The act result is called `actual`, the
value it is compared against `expected`.

```ts
it('should return expansion', () => {
    const cargoEdition: CargoEdition = {
        PageId: '206',
        Expansion: 'Promo',
        Edition: '1',
        Icon: 'Promo_icon.png',
    };
    const expected: Edition = {
        id: '206-1',
        expansion: 'Promo',
        edition: '1',
        icon: 'Promo_icon.png',
    };

    const actual = editionBuilder.build(cargoEdition);

    expect(actual).toEqual(expected);
});
```

Reference specs: `src/app/services/set.service.spec.ts` for a service,
`src/app/components/card-list/card-list.component.spec.ts` for a component,
`tools/wiki-bot/src/wiki-bot/builder/edition-builder.spec.ts` for the wiki bot.

## Naming

`describe` blocks nest twice: the outer one names the class under test, the inner one the member
under test - or `template` for assertions against rendered DOM.

Every `it` title starts with `should` and states the expectation. When several cases differ by their
precondition, put it in front: `with <precondition> should <expectation>`.

```txt
should return expansion
with spaces in icon should replace them by underscores
with grouping option is "without" should render "Without" menu item with "check" icon
```

## Test data in the app

Build models with `DataFixture` (`src/testing/data-fixture.ts`) rather than by hand. Every factory
takes a partial override, and the `create<Model>s` variants take an amount:

```ts
const card = dataFixture.createCard({ cost: 5 });
const editions = dataFixture.createEditions(2);
```

When a model has no factory yet, add one to `DataFixture` instead of assembling the object in the
spec.

## Doubles

Declare spies as `SpyObj<T>` from `src/testing/spy-obj` and create them with
`jasmine.createSpyObj<T>`, provided through the TestBed:

```ts
let shuffleServiceSpy: SpyObj<ShuffleService>;
// in configureTestingModule
{ provide: ShuffleService, useValue: jasmine.createSpyObj<ShuffleService>('ShuffleService', ['shuffleSingleCard']) }
```

## Component tests

Import the component under test in `TestBed.configureTestingModule({ imports: [...] })` and replace
its children with the stubs from `src/testing/components/` via `overrideComponent`:

```ts
.overrideComponent(CardListComponent, {
    remove: { imports: [CardComponent] },
    add: { imports: [CardStubComponent] },
});
```

Assertions against rendered DOM live in `describe('template')` and query through
`By.directive(...)`. When the template renders an observable, `detectChangesAndFlush`
(`src/testing/utilities.ts`) advances the marble scheduler between two change detection runs.

## Observables

Assert with `jasmine-marbles`: build the expectation with `cold()` and compare with
`toBeObservable`.

```ts
const expected$ = cold('a', { a: SetService.defaultSet });

const actual$ = setService.set$;

expect(actual$).toBeObservable(expected$);
```

## Several cases of the same shape

Write the cases out. Reach for a loop only when it saves several tests, and pass a named object
instead of a positional tuple, so the call site reads without scrolling back to the array:

```ts
// good, when it really saves tests
[{ triggeringCardTypeId: CardTypeId.Liaison, dependentCardTypeId: CardTypeId.Ally }].forEach(...)
```

Duplication in tests is cheaper than indirection the reader has to resolve.

## Runners

The app runs karma and needs a headless browser: `npm run test:ci`. The plain `npm test` script
watches and never returns.

The wiki bot is a separate workspace on plain jasmine: `npm run test:ci -w tools/wiki-bot`. It has
no TestBed and no `DataFixture` - build the cargo fixtures as literals in the spec. Everything else
above applies unchanged.
