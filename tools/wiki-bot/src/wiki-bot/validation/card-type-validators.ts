import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';
import { AmountValidator } from './amount-validator';

export class CardTypeValidator {
    readonly name: string = 'card type';

    private joiValidator = new JoiValidator<CardType>();
    private schema: Joi.ObjectSchema<CardType> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
    });

    validate(cardType: CardType, cardTypePage: CardTypePage): ValidationResult {
        return this.joiValidator.validate(
            cardType,
            this.schema,
            `Card type (Name: "${cardTypePage.title}"):`,
        );
    }
}

export class CardTypesValidator {
    readonly name: string = 'card types';

    private amountValidator = new AmountValidator<CardType, CardTypePage>();

    validate(cardTypes: CardType[], cardTypePages: CardTypePage[]): ValidationResult {
        return this.amountValidator.validate(
            cardTypes,
            cardTypePages,
            'For following card type pages no card type was generated:',
        );
    }
}
