import { ValidationResult } from './validation-result';

export class CargoIdUniquenessValidator {
    validate<TCargoEntity>(
        cargoEntities: TCargoEntity[],
        buildId: (cargoEntity: TCargoEntity) => string,
        failureMessageHeadline: string,
    ): ValidationResult {
        const occurrences = new Map<string, number>();
        for (const cargoEntity of cargoEntities) {
            const id = buildId(cargoEntity);
            occurrences.set(id, (occurrences.get(id) ?? 0) + 1);
        }

        const duplicateIds = [...occurrences]
            .filter(([_, occurrence]) => occurrence > 1)
            .map(([id, occurrence]) => `${id} (${occurrence} times)`);

        if (duplicateIds.length === 0) {
            return ValidationResult.Success;
        }

        const failureMessage = `${failureMessageHeadline}\n${duplicateIds.join('\n')}`;

        return ValidationResult.Failure(failureMessage);
    }
}
