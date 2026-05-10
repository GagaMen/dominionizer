import { EditionTranslation } from '../../../../../src/app/models/edition';
import { CargoEdition } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';
import Joi from 'joi';
import { ValidationResult } from './validation-result';

export class EditionTranslationValidator {
    readonly name: string = 'edition translation';

    private joiValidator = new JoiValidator<EditionTranslation>();
    private schema: Joi.ObjectSchema<EditionTranslation> = Joi.object({
        id: Joi.string().required(),
        expansion: Joi.string().required(),
    });

    validate(
        editionTranslation: EditionTranslation,
        language: string,
        cargoEdition: CargoEdition,
    ): ValidationResult {
        return this.joiValidator.validate(
            editionTranslation,
            this.schema,
            `Edition translation (Expansion: "${cargoEdition.Expansion}", Language: "${language}"):`,
        );
    }
}
