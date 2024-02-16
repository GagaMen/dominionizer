import { CardTypeTranslation } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTypeTranslationValidator {
    readonly name: string = 'card type translation';

    private joiValidator: JoiValidator<CardTypeTranslation> = new JoiValidator();
    private schema: Joi.ObjectSchema<CardTypeTranslation> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
    });

    validate(
        cardTypeTranslation: CardTypeTranslation,
        language: string,
        cardTypePage: CardTypePage,
    ): ValidationResult {
        return this.joiValidator.validate(
            cardTypeTranslation,
            this.schema,
            `Card type translation (Name: "${cardTypePage.title}", Language: "${language}"):`,
        );
    }
}
