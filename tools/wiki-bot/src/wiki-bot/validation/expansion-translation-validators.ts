import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { ExpansionPage } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';

export class ExpansionTranslationValidator
    implements Validator<[ExpansionTranslation, ExpansionPage]> {
    readonly name: string = 'expansion translation';

    private joiValidator: JoiValidator<ExpansionTranslation> = new JoiValidator();
    private schema: Joi.ObjectSchema<ExpansionTranslation> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
    });

    validate(
        expansionTranslation: ExpansionTranslation,
        expansionPage: ExpansionPage,
    ): ValidationResult {
        return this.joiValidator.validate(
            expansionTranslation,
            this.schema,
            `Expansion translation (ID: ${expansionTranslation.id}, Name: "${expansionPage.title}"):\n`,
        );
    }
}
