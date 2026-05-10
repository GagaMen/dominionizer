import { Edition } from '../../../../../src/app/models/edition';
import { JoiValidator } from './joi-validator';
import Joi from 'joi';
import { ValidationResult } from './validation-result';

export class EditionValidator {
    readonly name: string = 'edition';

    private joiValidator = new JoiValidator<Edition>();
    private schema: Joi.ObjectSchema<Edition> = Joi.object({
        id: Joi.string().required(),
        expansion: Joi.string().required(),
        edition: Joi.string().required(),
        icon: Joi.string().required(),
    });

    validate(edition: Edition): ValidationResult {
        return this.joiValidator.validate(
            edition,
            this.schema,
            `Edition (ID: ${edition.id}, Expansion: "${edition.expansion}"):`,
        );
    }
}
