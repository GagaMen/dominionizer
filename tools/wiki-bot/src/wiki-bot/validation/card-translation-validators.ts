import { CardPage, CargoCard } from './../wiki-client/api-models';
import { CardTranslation } from './../../../../../src/app/models/card';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTranslationValidator {
    readonly name: string = 'card translation';

    private joiValidator = new JoiValidator<CardTranslation>();
    private schema: Joi.ObjectSchema<CardTranslation> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().allow('').required(),
    });

    validate(
        _cardTranslation: CardTranslation,
        _language: string,
        _cardPage: CardPage,
    ): ValidationResult {
        return ValidationResult.Success;
    }

    validateFromCargo(
        cardTranslation: CardTranslation,
        language: string,
        cargoCard: CargoCard,
    ): ValidationResult {
        return this.joiValidator.validate(
            cardTranslation,
            this.schema,
            `Card translation (Name: "${cargoCard.Name}", Language: "${language}"):`,
        );
    }
}
