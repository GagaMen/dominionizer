import { buildCargoId } from '../builder/cargo-id';
import { ValidationResult } from './validation-result';

export class CargoAmountValidator<
    TEntity extends { id: string },
    TCargoEntity extends { PageId: string; Name: string },
> {
    validate(
        entities: TEntity[],
        cargoEntities: TCargoEntity[],
        failureMessageHeadline: string,
    ): ValidationResult {
        const cargoEntitiesWithoutEntity = cargoEntities
            .filter(
                (cargoEntity) =>
                    !entities.some((entity) => entity.id === buildCargoId(cargoEntity)),
            )
            .map((cargoEntity) => cargoEntity.Name);

        if (cargoEntitiesWithoutEntity.length === 0) {
            return ValidationResult.Success;
        }

        const failureMessage = `${failureMessageHeadline}\n${cargoEntitiesWithoutEntity.join('\n')}`;

        return ValidationResult.Failure(failureMessage);
    }
}
