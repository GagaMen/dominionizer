import {
    CardTypeTranslation,
    CardTypeTranslationV2,
} from '../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTypeTranslationValidator {
    readonly name: string = 'card type translation';

    private joiValidator = new JoiValidator<CardTypeTranslationV2>();
    private schema: Joi.ObjectSchema<CardTypeTranslationV2> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    });

    validate(
        _cardTypeTranslation: CardTypeTranslation,
        _language: string,
        _cardTypePage: CardTypePage,
    ): ValidationResult {
        return ValidationResult.Success;
    }

    validateFromCargo(
        cardTypeTranslation: CardTypeTranslationV2,
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
