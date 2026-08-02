import { CargoCard, CargoCardType, CargoEdition } from '../wiki-client/api-models';
import { buildCargoEditionId, buildCargoId } from './cargo-id';

describe('cargo-id', () => {
    describe('buildCargoId', () => {
        it('with cargo card should return its page id', () => {
            const cargoCard = { PageId: '11442', Name: 'Ronin' } as CargoCard;

            const actual = buildCargoId(cargoCard);

            expect(actual).toBe('11442');
        });

        it('with cargo card type should return its page id', () => {
            const cargoCardType = { PageId: '3081', Name: 'Landmark' } as CargoCardType;

            const actual = buildCargoId(cargoCardType);

            expect(actual).toBe('3081');
        });
    });

    describe('buildCargoEditionId', () => {
        it('should combine page id and edition', () => {
            const cargoEdition = {
                PageId: '914',
                Expansion: 'Dominion',
                Edition: '2',
            } as CargoEdition;

            const actual = buildCargoEditionId(cargoEdition);

            expect(actual).toBe('914-2');
        });

        it('with editions sharing a page should return distinct ids', () => {
            const secondEdition = {
                PageId: '1101',
                Expansion: 'Seaside',
                Edition: '2',
            } as CargoEdition;
            const firstEdition = {
                PageId: '1101',
                Expansion: 'Seaside',
                Edition: '1',
            } as CargoEdition;

            expect(buildCargoEditionId(secondEdition)).not.toBe(buildCargoEditionId(firstEdition));
        });
    });
});
