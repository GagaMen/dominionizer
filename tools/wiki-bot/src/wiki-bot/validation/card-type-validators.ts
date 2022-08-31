import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';

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
            `Card type (Name: "${cardTypePage.title}"):\n`,
        );
    }
}

export class CardTypesValidator implements Validator<[CardType[], CardTypePage[]]> {
    readonly name: string = 'card types';

    validate(cardTypes: CardType[], cardTypePages: CardTypePage[]): ValidationResult {
        const cardTypePagesWithoutCardType = cardTypePages
            .filter(
                (cardTypePage) =>
                    !cardTypes.some((cardType) => cardType.id === cardTypePage.pageid),
            )
            .map((cardTypePage) => cardTypePage.title);

        return cardTypePagesWithoutCardType.length === 0
            ? ValidationResult.Success
            : ValidationResult.Failure(
                  'For following card type pages no card type was generated:\n' +
                      cardTypePagesWithoutCardType.join('\n'),
              );
    }
}
