import { Edition } from 'src/app/models/edition';
import { CargoEdition } from '../wiki-client/api-models';
import { buildCargoEditionId } from './cargo-id';

export class EditionBuilder {
    build(cargoEdition: CargoEdition): Edition {
        return {
            id: buildCargoEditionId(cargoEdition),
            expansion: cargoEdition.Expansion,
            edition: cargoEdition.Edition,
            icon: cargoEdition.Icon.replace(' (expansion)', '').replaceAll(' ', '_'),
        };
    }
}
