import { CardPage } from './../wiki-client/api-models';
import { CardTranslation } from './../../../../../src/app/models/card';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTranslationValidator implements Validator<[CardTranslation, string, CardPage]> {
    readonly name: string = 'card translation';

    private joiValidator: JoiValidator<CardTranslation> = new JoiValidator();
    private schema: Joi.ObjectSchema<CardTranslation> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().allow('').required(),
        description: Joi.array().items(Joi.string()).required(),
    });

    validate(
        cardTranslation: CardTranslation,
        language: string,
        cardPage: CardPage,
    ): ValidationResult {
        return this.joiValidator.validate(
            cardTranslation,
            this.schema,
            `Card translation (Name: "${cardPage.title}", Language: "${language}"):\n`,
        );
    }
}
