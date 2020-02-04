# Dominiontabs Converter

This tool converts the card data of the [Dominiontabs](https://github.com/sumpfork/dominiontabs) project to the data structure of Dominionizer.

## Run
Execute `npm start` to run the converter. The data are written to `./output/cards.json`.

## Data Mapping
This section describes the mapping between the properties of the two data structures.
- `card_tag`
  - internal name of card
  - string
  - --> `name`
- `cardset_tags`
  - internal name of expansions, the card belongs to
  - string[]
  - --> if contains "base" then ignore card
  - --> `expansion`
- `cost`
  - cost of the card
  - string
  - --> `cost`
- `count`
  - amount of cards
  - string
  - optional
  - --> ignore
- `potcost`
  - card needs a potion to buy it
  - string
  - optional
  - --> `potion`
- `group_tag`
  - subset of expansion
  - string
  - --> ignore
- `group_top`
  - card is on top in mixed stack
  - boolean
  - --> ignore
- `debtcost`
  - amount of debts to buy the card
  - string
  - optional
  - --> `debt`
- `randomizer`
  - card has a randomizer card (blue border)
  - boolean
  - --> ignore
- `types`
  - internal type names of the card
  - string[]
  - --> `types`
