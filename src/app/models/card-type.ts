export interface CardType {
    id: CardTypeId;
    name: string;
}

export interface CardTypeV2 {
    id: string;
    name: string;
    scope: string;
}

export type CardTypeTranslation = Pick<CardType, 'id' | 'name'>;

export enum CardTypeId {
    Curse = 212,
    Action = 216,
    Reaction = 217,
    Victory = 218,
    Attack = 219,
    Treasure = 220,
    Prize = 431,
    Shelter = 522,
    Ruins = 550,
    Knight = 577,
    Duration = 593,
    Looter = 689,
    Reserve = 1583,
    Event = 1584,
    Traveller = 2114,
    Landmark = 2821,
    Gathering = 3258,
    Castle = 3304,
    Night = 4216,
    Heirloom = 4217,
    Fate = 4218,
    Doom = 4219,
    Boon = 4220,
    Hex = 4221,
    Spirit = 5165,
    State = 5251,
    Zombie = 5356,
    Project = 6107,
    Artifact = 6108,
    Command = 6442,
    Way = 6808,
    Ally = 8083,
    Liaison = 8084,
    Augur = 8130,
    Odyssey = 8132,
    Townsfolk = 8192,
    Wizard = 8236,
    Fort = 8377,
    Clash = 8378,
    Trait = 9293,
    Loot = 9346,
}
