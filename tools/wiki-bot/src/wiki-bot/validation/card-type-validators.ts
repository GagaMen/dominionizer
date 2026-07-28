import { CardType } from '../../../../../src/app/models/card-type';
import { CargoCardType } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { CargoAmountValidator } from './cargo-amount-validator';
import { JoiValidator } from './joi-validator';

export class CardTypeValidator {
    readonly name: string = 'card type';

    private joiValidator = new JoiValidator<CardType>();
    private schema: Joi.ObjectSchema<CardType> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        scope: Joi.string().required(),
    });

    validate(cardType: CardType): ValidationResult {
        return this.joiValidator.validate(
            cardType,
            this.schema,
            `Card type (ID: ${cardType.id}, Name: "${cardType.name}"):`,
        );
    }
}

export class CardTypesValidator {
    readonly name: string = 'card types';

    private cargoAmountValidator = new CargoAmountValidator<CardType, CargoCardType>();

    validate(cardTypes: CardType[], cargoCardTypes: CargoCardType[]): ValidationResult {
        return this.cargoAmountValidator.validate(
            cardTypes,
            cargoCardTypes,
            'For following cargo card types no card type was generated:',
        );
    }
}
