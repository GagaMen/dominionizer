import { AmountValidator } from './amount-validator';
import { CardType } from './../../../../../src/app/models/card-type';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { Validator } from './validator';
import { CardPage } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';
import * as Joi from 'joi';
import { ValidationResult } from './validation-result';

export class CardDtoValidator implements Validator<[CardDto, CardPage]> {
    readonly name: string = 'card dto';

    private joiValidator: JoiValidator<CardDto> = new JoiValidator();
    private schema: Joi.ObjectSchema<CardDto> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.array().items(Joi.string()).min(1).required(),
        image: Joi.string().required(),
        wikiUrl: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
        expansions: Joi.array().items(Joi.number()).min(1).required(),
        types: Joi.array().items(Joi.number()).min(1).required(),
        isKingdomCard: Joi.boolean().required(),
        cost: Joi.number().integer().min(0).required(),
        costModifier: Joi.string().valid('P', '*', '+').optional(),
        debt: Joi.number().integer().min(0).optional(),
    });

    validate(card: CardDto, cardPage: CardPage): ValidationResult {
        return this.joiValidator.validate(
            card,
            this.schema,
            `Card Dto (ID: ${card.id}, Name: "${cardPage.title}"):\n`,
        );
    }
}

export class CardDtosValidator implements Validator<[CardDto[], CardType[], CardPage[]]> {
    readonly name: string = 'card dtos';

    private amountValidator: AmountValidator<CardDto, CardPage> = new AmountValidator();

    validate(cards: CardDto[], cardTypes: CardType[], cardPages: CardPage[]): ValidationResult {
        const cardsWithoutCardTypes = cards.filter(
            (card: CardDto) => !cardTypes.some((cardType: CardType) => cardType.id === card.id),
        );

        return this.amountValidator.validate(
            cardsWithoutCardTypes,
            cardPages,
            'For following card pages no card was generated:\n',
        );
    }
}
