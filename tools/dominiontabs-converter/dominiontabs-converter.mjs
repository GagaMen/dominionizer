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
  ignoredExpansions = new Set([
    'dominion2ndEditionUpgrade',
    'intrigue2ndEditionUpgrade',
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
    ['Way', 29],
    ['Zombie', 30],
  ]);
  splitPileCards = new Set([
    'Settlers',
    'Bustling Village',
    'Patrician',
    'Emporium',
    'Gladiator',
    'Fortune',
    'Encampment',
    'Plunder',
    'Catapult',
    'Rocks',
    'Sauna',
    'Avanto',
    'Castles',
  ]);

  constructor(dataSource, outputPath) {
    this.dataSource = dataSource;
    this.outputPath = outputPath;
  }

  async run() {
    const data = await fetch(this.dataSource).then(res => res.json());

    const cards = data.filter(cardData => this.shouldCardBeCreated(cardData))
      .map(cardData => this.createCard(cardData));

    fs.mkdirSync(this.outputPath, { recursive: true });
    fs.writeFileSync(`${this.outputPath}/cards.json`, JSON.stringify(cards));
  }

  shouldCardBeCreated(cardData) {
    return !(cardData.cardset_tags.includes('base') || cardData.cardset_tags.includes('animals'));
  }

  createCard(cardData) {
    return {
      id: this.createCardId(),
      name: cardData.card_tag,
      expansions: this.createExpansions(cardData.cardset_tags),
      types: this.createTypes(cardData.types),
      isKingdomCard: this.splitPileCards.has(cardData.card_tag) || cardData.randomizer === undefined,
      isPartOfSplitPile: this.splitPileCards.has(cardData.card_tag) || undefined,
      isOnTopOfSplitPile: cardData.card_tag === 'Castles'
        || (this.splitPileCards.has(cardData.card_tag) && cardData.group_top)
        || undefined,
      cost: cardData.cost ? Number.parseInt(cardData.cost) : 0,
      debt: cardData.debtcost ? Number.parseInt(cardData.debtcost) : undefined,
      potion: cardData.potcost ? true : undefined,
    }
  }

  createCardId() {
    this.cardIdCount++;
    return this.cardIdCount;
  }

  createExpansions(expansionsData) {
    return expansionsData.filter(expansion => this.shouldExpansionBeCreated(expansion))
      .map(expansion => this.expansionsMap.get(expansion));
  }

  shouldExpansionBeCreated(expansion) {
    const isKnown = this.expansionsMap.has(expansion);
    const isIgnored = this.ignoredExpansions.has(expansion);

    if (isIgnored) {
        return false;
    }
    if (!isKnown && !isIgnored) {
      console.warn(`Expansion '${expansion}' is unknown and not on the ignore list!`);
      return false;
    }

    return true;
  }

  createTypes(typeData) {
    return typeData.filter(type => this.shouldTypeBeCreated(type))
      .map(type => this.typesMap.get(type));
  }

  shouldTypeBeCreated(type) {
    const isKnown = this.typesMap.has(type);

    if (!isKnown) {
      console.warn(`Type '${type}' is unknown!`);
      return false;
    }

    return true;
  }
}
