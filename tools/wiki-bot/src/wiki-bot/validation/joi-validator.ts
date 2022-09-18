import { ValidationResult } from './validation-result';
import * as Joi from 'joi';

export class JoiValidator<T> {
    validate(
        entity: T,
        schema: Joi.ObjectSchema<T>,
        failureMessageHeadline: string,
    ): ValidationResult {
        const validationResult: Joi.ValidationResult<T> = schema.validate(entity, {
            abortEarly: false,
        });

        if (validationResult.error === undefined) {
            return ValidationResult.Success;
        }

        const errorMessages: string[] = validationResult.error.details.map(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            (error: Joi.ValidationErrorItem) => error.message,
        );

        const failureMessage = `${failureMessageHeadline}\n${errorMessages.join('\n')}`;

        return ValidationResult.Failure(failureMessage);
    }
}
