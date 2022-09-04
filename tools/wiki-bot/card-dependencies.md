# Card Dependencies

## Dependencies On Other Cards

### Split Pile

-   top cards + bottom cards
-   have extra randomizer card with different card art (but card art is not on the wiki)
-   split pile cards can't be detected via card page directly (unless you look for a link to the split pile page in the introduction)
-   all split pile cards are listed on the [split pile page](http://wiki.dominionstrategy.com/index.php/Split_pile)

### Curser

-   cards that potentially distribute "Curse" cards
-   detectable through `Curse` in their card text

### Potion

-   cards that cost a "Potion"
-   detectable through the `Cost` property of their infobox

### Ruins

-   cards that can be gained through normal Kingdom cards
-   detectable through `Ruins` in the card text

### Horses

-   cards that can be gained through Kingdom cards
-   detectable through `Horse(s)` in the card text

### Boons

-   "Fate" cards interact with "Boons"
-   detectable through the card type

### Hexes

-   "Doom" cards interact with "Hexes"
-   detectable through the card type

### States

-   "Hexes" interact with "States"
-   detectable through the card type
-   "Fool" is an exception because it is no "Hexe" and interacts with "Lost in the Woods"
-   detectable through `Lost in the Woods` in the card text

### Shelters

-   cards that can replace "Estates" in starting decks in games using Kingdom cards from Dark Ages
-   whether they replace "Estates" is determined randomly, based on the proportion of Dark Ages cards in use

### Heirlooms

-   "Heirlooms" belong to a normal card and replace one starting copper if the corresponding card is in the Kingdom
-   detectable through `Heirloom:` in the card text

### Spirits

-   "Spirit" cards are non-supply cards
-   "Exorcist" interacts with all of them, which is detectable through `Spirit` in the card text
-   other cards interact only with one specific "Spirit" (see [Non-supply Cards](#non-supply-cards))

### Knights

-   "Knight" is a card type with ten different cards that build one pile
-   special randomizer card that has no card page on the wiki
-   but there is a [card type page](http://wiki.dominionstrategy.com/index.php/Knight) that has all necessary information

### Castles

-   "Castle" is a card type with eight different cards that build one pile
-   special randomizer card that has no card page on the wiki
-   but there is a [card type page](http://wiki.dominionstrategy.com/index.php/Castle) that has all necessary information

### Zombies

-   "Necromancer" interacts with "Zombie" cards
-   only card with this mechanic
-   detectable through `Zombies` in the card text

### Prizes

-   "Prize" cards, that are not in the supply, can be gained by the "Tournament" card
-   only card with this mechanic

### Young Witch

-   "Young Witch" adds an extra Kingdom card to the game as "Bane" card
-   only card with this mechanic

### Way of the Mouse

-   "Way of the Mouse" needs to set up an extra "Action" card outside of the Kingdom
-   only card with this mechanic

### Black Market

-   "Black Market" needs to set up an extra card pile of unused Kingdom cards (of any amount)
-   only card with this mechanic

### Non-supply Cards

-   cards that interact with a specific card that is not in the supply
-   detectable through the name of the non-supply card in their description

| Expansion   | Supply card      | Non-supply card |
| ----------- | ---------------- | --------------- |
| Dark Ages   | Hermit           | Madman          |
|             | Urchin           | Mercanery       |
|             | Marauder         | Spoils          |
|             | Bandit Camp      | Spoils          |
|             | Pillage          | Spoils          |
| Adventures  | Page             | Treasure Hunter |
|             | Treasure Hunter  | Warrior         |
|             | Warrior          | Hero            |
|             | Hero             | Champion        |
|             | Peasant          | Soldier         |
|             | Soldier          | Fugitive        |
|             | Fugitive         | Disciple        |
|             | Disciple         | Teacher         |
| Nocturne    | Leprechaun       | Wish            |
|             | Devil's Workshop | Imp             |
|             | Tormentor        | Imp             |
|             | Vampire          | Bat             |
|             | Bat              | Vampire         |
|             | Haunted Mirror   | Ghost           |
|             | Magic Lamp       | Whish(es)       |
|             | The Swamp's Gift | Will-o'-Wisp    |
| Renaissance | Border Guard     | Lantern         |
|             | Border Guard     | Horn            |
|             | Flag Bearer      | Flag            |
|             | Swashbuckler     | Treasure Chest  |

## Dependencies On Other Materials

### Tokens

-   cards that interact with tokens
-   detectable through the name or symbol of the specific token in their card text (or for Debt also in their cost property)
-   an exception are the wooden cubes from "Renaissance" that are used to track "Projects"

| Token     | Expression                | Example                                                                   |
| --------- | ------------------------- | ------------------------------------------------------------------------- |
| Victory   | `'''+1'''{{VP}}`          | [Bishop](http://wiki.dominionstrategy.com/index.php/Bishop)               |
|           | `add '''1'''{{VP}}`       | [Wild Hunt](http://wiki.dominionstrategy.com/index.php/Wild_Hunt)         |
|           | `Put '''6'''{{VP}}`       | [Arena](http://wiki.dominionstrategy.com/index.php/Arena)                 |
| Coin      | `Coin token`              | [Pirate Ship](http://wiki.dominionstrategy.com/index.php/Pirate_Ship)     |
| Embargo   | `Embargo token`           | [Embargo](http://wiki.dominionstrategy.com/index.php/Embargo)             |
| Coffers   | `Coffers`                 | [Plaza](http://wiki.dominionstrategy.com/index.php/Plaza)                 |
| Villagers | `Villager(s)`             | [Lackeys](http://wiki.dominionstrategy.com/index.php/Lackeys)             |
| Undefined | `token`                   | [Sinister Plot](http://wiki.dominionstrategy.com/index.php/Sinister_Plot) |
| Trashing  | `Trashing token`          | [Plan](http://wiki.dominionstrategy.com/index.php/Plan)                   |
| Journey   | `Journey token`           | [Ranger](http://wiki.dominionstrategy.com/index.php/Ranger)               |
| Estate    | `Estate token`            | [Inheritance](http://wiki.dominionstrategy.com/index.php/Inheritance)     |
| +1 Action | `+1 Action token`         | [Lost Arts](http://wiki.dominionstrategy.com/index.php/Lost_Arts)         |
| +1 Buy    | `+1 Buy token`            | [Seaway](http://wiki.dominionstrategy.com/index.php/Seaway)               |
| +1 Card   | `+1 Card token`           | [Pathfinding](http://wiki.dominionstrategy.com/index.php/Pathfinding)     |
| +1 Coin   | `+{{Cost\|1}} token`      | [Training](http://wiki.dominionstrategy.com/index.php/Training)           |
| -2 Cost   | `-{{Cost\|2}} cost token` | [Ferry](http://wiki.dominionstrategy.com/index.php/Ferry)                 |
| -1 Card   | `–1 Card token`           | [Relic](http://wiki.dominionstrategy.com/index.php/Relic)                 |
| -1 Coin   | `–{{Cost\|1}} token`      | [Ball](http://wiki.dominionstrategy.com/index.php/Ball)                   |
| Debt      | `\|cost2 = 4`             | [Engineer](http://wiki.dominionstrategy.com/index.php/Engineer)           |
|           | `{{Debt\|6}}`             | [Capital](http://wiki.dominionstrategy.com/index.php/Capital)             |

### Player Mats

-   cards that interact with player mats
-   detectable through the name of the specific mat in their card text

| Mat            | Expression           | Example                                                                     |
| -------------- | -------------------- | --------------------------------------------------------------------------- |
| Island         | `Island mat`         | [Island](http://wiki.dominionstrategy.com/index.php/Island)                 |
| Pirate Ship    | `Pirate Ship mat`    | [Pirate Ship](http://wiki.dominionstrategy.com/index.php/Pirate_Ship)       |
| Native Village | `Native Village mat` | [Native Village](http://wiki.dominionstrategy.com/index.php/Native_Village) |
| Trade Route    | `Trade Route mat`    | [Trade Route](http://wiki.dominionstrategy.com/index.php/Trade_Route)       |
| Tavern         | `Tavern mat`         | [Guide](http://wiki.dominionstrategy.com/index.php/Guide)                   |
| Coffers        | `Coffers`            | [Plaza](http://wiki.dominionstrategy.com/index.php/Plaza)                   |
| Villagers      | `Villager(s)`        | [Lackeys](http://wiki.dominionstrategy.com/index.php/Lackeys)               |
| Exile          | `Exile(s)`           | [Camel Train](http://wiki.dominionstrategy.com/index.php/Camel_Train)       |
