import cardTypes from '../../data/card-types.json';
import { CardType, CardTypeId } from './card-type';

describe('CardTypeId', () => {
    // The ids come from the Cargo "Types" table and are row ids, which the wiki
    // reassigns whenever a type page is reparsed. A drifted id makes the app
    // silently stop finding cards of that type, so pin the enum to the data.
    it('should name a generated card type for every entry', () => {
        const generatedCardTypes = cardTypes as CardType[];

        const mismatches = Object.entries(CardTypeId)
            .filter(([name, id]) => generatedCardTypes.find((c) => c.id === id)?.name !== name)
            .map(([name, id]) => `${name} = '${id}'`);

        expect(mismatches).toEqual([]);
    });

    it('should have an entry for every generated card type', () => {
        const knownIds: string[] = Object.values(CardTypeId);

        const missing = (cardTypes as CardType[])
            .filter((cardType) => !knownIds.includes(cardType.id))
            .map((cardType) => `${cardType.name} = '${cardType.id}'`);

        expect(missing).toEqual([]);
    });
});
