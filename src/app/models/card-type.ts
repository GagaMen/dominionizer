// A const object instead of an enum: CardType.id is a plain string from the
// wiki, and comparing it against a string enum trips no-unsafe-enum-comparison.
export const CardTypeId = {
    Spirit: '196',
    Action: '241',
    Knight: '263',
    Ruins: '264',
    Treasure: '266',
    Victory: '267',
    Reaction: '270',
    Prize: '273',
    Reward: '274',
    Doom: '275',
    Fate: '276',
    Command: '277',
    Loot: '279',
    Odyssey: '280',
    Augur: '281',
    Clash: '282',
    Fort: '283',
    Townsfolk: '284',
    Wizard: '285',
    Liaison: '286',
    Omen: '289',
    Gathering: '290',
    Zombie: '291',
    Heirloom: '292',
    Shelter: '296',
    Traveller: '297',
    Project: '300',
    Way: '301',
    Ally: '302',
    Boon: '304',
    Hex: '305',
    State: '307',
    Shadow: '309',
    Reserve: '311',
    Trait: '312',
    Duration: '313',
    Looter: '314',
    Night: '315',
    Attack: '316',
    Castle: '317',
    Artifact: '318',
    Landmark: '319',
    Event: '320',
    Prophecy: '321',
    Curse: '322',
} as const;

export type CardTypeId = (typeof CardTypeId)[keyof typeof CardTypeId];

export interface CardType {
    id: string;
    name: string;
    scope: string;
}

export type CardTypeTranslation = Pick<CardType, 'id' | 'name'>;
