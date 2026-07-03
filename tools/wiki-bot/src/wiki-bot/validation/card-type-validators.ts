import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';

export class CardTypeValidator {
    readonly name: string = 'card type';

    private joiValidator = new JoiValidator<CardType>();
    private schema: Joi.ObjectSchema<CardType> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        scope: Joi.string().required(),
    });

    validate(_cardType: CardType, _cardTypePage: CardTypePage): ValidationResult {
        return ValidationResult.Success;
    }

    validateFromCargo(cardType: CardType): ValidationResult {
        return this.joiValidator.validate(
            cardType,
            this.schema,
            `Card type (ID: ${cardType.id}, Name: "${cardType.name}"):`,
        );
    }
}

export class CardTypesValidator {
    readonly name: string = 'card types';

    validate(_cardTypes: CardType[], _cardTypePages: CardTypePage[]): ValidationResult {
        return ValidationResult.Success;
    }
}
