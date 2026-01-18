import { CardType, CardTypeV2 } from '../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType } from '../wiki-client/api-models';

export class CardTypeBuilder {
    build(cardTypePage: CardTypePage): CardType {
        return {
            id: cardTypePage.pageid,
            name: cardTypePage.title,
        };
    }

    buildFromCargo(cargoCardType: CargoCardType): CardTypeV2 {
        return {
            id: cargoCardType.Id,
            name: cargoCardType.Name,
            scope: cargoCardType.Scope,
        };
    }
}
