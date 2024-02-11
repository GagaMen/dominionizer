import { CardPage } from './../wiki-client/api-models';
import { CardTranslation } from './../../../../../src/app/models/card';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTranslationValidator {
    readonly name: string = 'card translation';

    private joiValidator: JoiValidator<CardTranslation> = new JoiValidator();
    private schema: Joi.ObjectSchema<CardTranslation> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().allow('').required(),
    });

    validate(
        cardTranslation: CardTranslation,
        language: string,
        cardPage: CardPage,
    ): ValidationResult {
        return this.joiValidator.validate(
            cardTranslation,
            this.schema,
            `Card translation (Name: "${cardPage.title}", Language: "${language}"):`,
        );
    }
}
