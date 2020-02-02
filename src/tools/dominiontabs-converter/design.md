# Dominiontabs Converter [https://github.com/sumpfork/dominiontabs]

Divider generator for the card game Dominion and its expansions. http://domtabs.sandflea.org

## cards_db
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
  - --> `debt`
- `randomizer`
  - card has a randomizer card (blue border)
  - boolean
  - --> ignore
- `types`
  - internal type names of the card
  - string[]
  - --> `types`
