import { ValidationResult } from './validation-result';

export class CargoAmountValidator<
    TEntity extends { id: string },
    TCargoEntity extends { Id: string; Name: string },
> {
    validate(
        entities: TEntity[],
        cargoEntities: TCargoEntity[],
        failureMessageHeadline: string,
    ): ValidationResult {
        const cargoEntitiesWithoutEntity = cargoEntities
            .filter((cargoEntity) => !entities.some((entity) => entity.id === cargoEntity.Id))
            .map((cargoEntity) => cargoEntity.Name);

        if (cargoEntitiesWithoutEntity.length === 0) {
            return ValidationResult.Success;
        }

        const failureMessage = `${failureMessageHeadline}\n${cargoEntitiesWithoutEntity.join('\n')}`;

        return ValidationResult.Failure(failureMessage);
    }
}
