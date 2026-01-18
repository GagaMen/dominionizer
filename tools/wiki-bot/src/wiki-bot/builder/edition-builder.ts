import { Edition } from 'src/app/models/edition';
import { CargoEdition } from '../wiki-client/api-models';

export class EditionBuilder {
    build(cargoEdition: CargoEdition): Edition {
        return {
            id: cargoEdition.Id,
            expansion: cargoEdition.Expansion,
            edition: cargoEdition.Edition,
            icon: cargoEdition.Icon,
        };
    }
}
