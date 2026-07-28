import { CardTypeTranslation } from '../../../../../src/app/models/card-type';
import { CargoCardType } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTypeTranslationValidator {
    readonly name: string = 'card type translation';

    private joiValidator = new JoiValidator<CardTypeTranslation>();
    private schema: Joi.ObjectSchema<CardTypeTranslation> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    });

    validate(
        cardTypeTranslation: CardTypeTranslation,
        language: string,
        cargoCardType: CargoCardType,
    ): ValidationResult {
        return this.joiValidator.validate(
            cardTypeTranslation,
            this.schema,
            `Card type translation (Name: "${cargoCardType.Name}", Language: "${language}"):`,
        );
    }
}
