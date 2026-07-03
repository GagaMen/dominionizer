import { CardType } from '../../../../../src/app/models/card-type';
import { CargoCardType } from '../wiki-client/api-models';

export class CardTypeBuilder {
    build(cargoCardType: CargoCardType): CardType {
        return {
            id: cargoCardType.Id,
            name: cargoCardType.Name,
            scope: cargoCardType.Scope,
        };
    }
}
