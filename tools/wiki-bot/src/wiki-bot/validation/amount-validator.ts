import { Page } from '../wiki-client/api-models';
import { ValidationResult } from './validation-result';

export class AmountValidator<TEntity extends { id: number }, TPage extends Page> {
    validate(
        entities: TEntity[],
        pages: TPage[],
        failureMessageHeadline: string,
    ): ValidationResult {
        const pagesWithoutEntity = pages
            .filter((page) => !entities.some((entity) => entity.id === page.pageid))
            .map((page) => page.title);

        if (pagesWithoutEntity.length === 0) {
            return ValidationResult.Success;
        }

        const failureMessage = failureMessageHeadline + pagesWithoutEntity.join('\n');

        return ValidationResult.Failure(failureMessage);
    }
}
