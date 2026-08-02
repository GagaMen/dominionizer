import { CardType } from '../../../../../src/app/models/card-type';
import { CargoCardType } from '../wiki-client/api-models';
import { buildCargoId } from './cargo-id';

export class CardTypeBuilder {
    build(cargoCardType: CargoCardType): CardType {
        return {
            id: buildCargoId(cargoCardType),
            name: cargoCardType.Name,
            scope: cargoCardType.Scope,
        };
    }
}
