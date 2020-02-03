import fetch from 'node-fetch';
import * as fs from 'fs';

export class DominiontabsConverter {
  dataSource = '';
  outputPath = '';
  cardIdCount = 0;
  expansionsMap = new Map([
    ['dominion1stEdition', 1],
    ['dominion2ndEdition', 2],
    ['intrigue1stEdition', 3],
    ['intrigue2ndEdition', 4],
    ['seaside', 5],
    ['alchemy', 6],
    ['prosperity', 7],
    ['cornucopia', 8],
    ['hinterlands', 9],
    ['dark ages', 10],
    ['guilds', 11],
    ['adventures', 12],
    ['empires', 13],
    ['nocturne', 14],
    ['renaissance', 15],
    ['menagerie', 16],
    ['promo', 99],
  ]);
  typesMap = new Map([
    ['Action', 1],
    ['Artifact', 2],
    ['Attack', 3],
    ['Boon', 4],
    ['Castle', 5],
    ['Curse', 6],
    ['Doom', 7],
    ['Duration', 8],
    ['Event', 9],
    ['Fate', 10],
    ['Gathering', 11],
    ['Heirloom', 12],
    ['Hex', 13],
    ['Knight', 14],
    ['Landmark', 15],
    ['Looter', 16],
    ['Night', 17],
    ['Prize', 18],
    ['Project', 19],
    ['Reaction', 20],
    ['Reserve', 21],
    ['Ruins', 22],
    ['Shelter', 23],
    ['Spirit', 24],
    ['State', 25],
    ['Traveller', 26],
    ['Treasure', 27],
    ['Victory', 28],
    ['Zombie', 29],
  ]);

  constructor(dataSource, outputPath) {
    this.dataSource = dataSource;
    this.outputPath = outputPath;
  }

  async run() {
    const data = await fetch(this.dataSource).then(res => res.json());

    const cards = data.map(cardData => this.createCard(cardData));

    fs.mkdirSync(this.outputPath, { recursive: true });
    fs.writeFileSync(`${this.outputPath}/cards.json`, JSON.stringify(cards));
  }

  createCard(cardData) {
    if (cardData.cardset_tags.includes('base')) {
      return undefined;
    }

    return {
      id: this.createCardId(),
      name: cardData.card_tag,
      expansions: this.createExpansions(cardData.cardset_tags),
      types: this.createTypes(cardData.types),
      cost: Number.parseInt(cardData.cost),
      debt: cardData.debtcost ? Number.parseInt(cardData.debtcost) : undefined,
      potion: cardData.potcost ? true : undefined,
    }
  }

  createCardId() {
    this.cardIdCount++;
    return this.cardIdCount;
  }

  createExpansions(expansionsData) {
    return expansionsData.map(expansion => {
      if (!this.expansionsMap.has(expansion)) {
        console.warn(`Expansion '${expansion}' is unknown!`);
        return null;
      }

      return this.expansionsMap.get(expansion);
    });
  }

  createTypes(typeData) {
    return typeData.map(type => {
      if (!this.typesMap.has(type)) {
        console.warn(`Type '${type}' is unknown!`);
        return null;
      }

      return this.typesMap.get(type);
    });
  }
}
