# Dominiontabs Converter

This tool converts the card data of the [Dominiontabs](https://github.com/sumpfork/dominiontabs) project to the data structure of Dominionizer.

## Run

Execute `npm start` to run the converter. The data are written to `./dist/cards.json`.

## Data Mapping

This section describes the mapping between the properties of the two data structures.

-   `card_tag`
    -   internal name of card
    -   string
    -   --> `name`
-   `cardset_tags`
    -   internal name of expansions the card belongs to
    -   string[]
    -   --> if contains "base" then ignore card
    -   --> `expansion`
-   `cost`
    -   cost of the card
    -   string
    -   --> `cost`
-   `count`
    -   amount of cards
    -   string
    -   optional
    -   --> ignore
-   `potcost`
    -   card needs a potion to buy it
    -   string
    -   optional
    -   --> `potion`
-   `group_tag`
    -   internal name of a group of cards that belong together (e.g. events of an expansion or split piles)
    -   string
    -   optional
    -   --> ignore
-   `group_top`
    -   card is on top in a split pile
    -   boolean
    -   --> `isOnTopOfSplitPile`
-   `debtcost`
    -   amount of debts to buy the card
    -   string
    -   optional
    -   --> `debt`
-   `randomizer`
    -   card has a randomizer card (blue border)
    -   boolean
    -   --> influences `isKingdomCard`
-   `types`
    -   internal type names of the card
    -   string[]
    -   --> `types`
