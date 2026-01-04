import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { ExpansionPage } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';

export class ExpansionTranslationValidator {
    readonly name: string = 'expansion translation';

    private joiValidator = new JoiValidator<ExpansionTranslation>();
    private schema: Joi.ObjectSchema<ExpansionTranslation> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
    });

    validate(
        expansionTranslation: ExpansionTranslation,
        language: string,
        expansionPage: ExpansionPage,
    ): ValidationResult {
        return this.joiValidator.validate(
            expansionTranslation,
            this.schema,
            `Expansion translation (Name: "${expansionPage.title}", Language: "${language}"):`,
        );
    }
}
