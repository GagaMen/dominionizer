import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';
import { AmountValidator } from './amount-validator';

export class CardTypeValidator implements Validator<[CardType, CardTypePage]> {
    readonly name: string = 'card type';

    private joiValidator: JoiValidator<CardType> = new JoiValidator();
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

export class CardTypesValidator implements Validator<[CardType[], CardTypePage[]]> {
    readonly name: string = 'card types';

    private amountValidator: AmountValidator<CardType, CardTypePage> = new AmountValidator();

    validate(cardTypes: CardType[], cardTypePages: CardTypePage[]): ValidationResult {
        return this.amountValidator.validate(
            cardTypes,
            cardTypePages,
            'For following card type pages no card type was generated:',
        );
    }
}
